import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Color } from "three";

interface GlobeProps {
  className?: string;
}

export default function Globe({ className }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1) Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2) Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 3) Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(5.2, 32, 32);
    const atmMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0,0,1)), 2.0);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new Color(0x3a86ff) }
      }
    });
    const atmMesh = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atmMesh);

    // 4) Wireframe globe
    const wireGeo = new THREE.SphereGeometry(5, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x3a86ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // 5) Solid globe (will fade in texture)
    const solidGeo = new THREE.SphereGeometry(4.9, 64, 64);
    const solidMat = new THREE.MeshPhongMaterial({
      color: 0x1a237e,
      transparent: true,
      opacity: 0
    });
    const solidMesh = new THREE.Mesh(solidGeo, solidMat);
    scene.add(solidMesh);

    // 6) Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 7) Color cycle
    // const palette = [
    //   new Color(0x3a86ff),
    //   new Color(0x8338ec),
    //   new Color(0xff006e),
    //   new Color(0xfb5607),
    //   new Color(0xffbe0b)
    // ];
    const generateAllColors = (steps: number): THREE.Color[] => {
      const colors: THREE.Color[] = [];
      for (let i = 0; i < steps; i++) {
        const hue = (i / steps) * 360; // full spectrum
        const color = new THREE.Color();
        color.setHSL(hue / 360, 1.0, 0.5); // vivid & balanced
        colors.push(color);
      }
      return colors;
    };

    const palette = generateAllColors(100); // 100 = super smooth, full-spectrum


    let ci = 0, ni = 1, t = 0;
    const speed = 0.02;
    const lerpColor = (a: Color, b: Color, f: number) =>
      new Color(a.r + (b.r - a.r) * f, a.g + (b.g - a.g) * f, a.b + (b.b - a.b) * f);

    // 8) Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotate
      wireMesh.rotation.y += 0.002;
      solidMesh.rotation.y += 0.002;
      atmMesh.rotation.y += 0.001;
      stars.rotation.y += 0.0005;

      // Color transition
      t += speed;
      if (t >= 1) {
        t = 0;
        ci = ni;
        ni = (ni + 1) % palette.length;
      }
      const col = lerpColor(palette[ci], palette[ni], t);
      wireMat.color = col;
      (solidMat as THREE.MeshPhongMaterial).color = col;
      atmMat.uniforms.glowColor.value = col;

      renderer.render(scene, camera);
    };
    animate();


    // 10) Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // 11) Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);

      // Dispose objects
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mat = mesh.material as THREE.Material | THREE.MeshPhongMaterial;
          if ('map' in mat && mat.map) mat.map.dispose();
          mat.dispose();
        }
      });
      renderer.dispose();

      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`fixed inset-0 z-0 ${className || ""}`} />;
}
