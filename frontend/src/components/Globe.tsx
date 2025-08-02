// "use client"

// import { useEffect, useRef, useState } from "react"
// import * as THREE from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { Color } from "three"

// export default function Globe() {
//   const mountRef = useRef<HTMLDivElement>(null)
//   const [isHighResLoaded, setIsHighResLoaded] = useState(false)
//   const [showHint, setShowHint] = useState(true)

//   useEffect(() => {
//     if (!mountRef.current) return

//     // Create scene, camera, and renderer
//     const scene = new THREE.Scene()
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     renderer.setPixelRatio(window.devicePixelRatio)
//     mountRef.current.appendChild(renderer.domElement)

//     // Create a starfield
//     const starsGeometry = new THREE.BufferGeometry()
//     const starsCount = 10000
//     const positions = new Float32Array(starsCount * 3)
//     for (let i = 0; i < starsCount; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 2000
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 2000
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 2000
//     }
//     starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
//     const starsMaterial = new THREE.PointsMaterial({
//       color: 0xffffff,
//       size: 0.7,
//       sizeAttenuation: true,
//     })
//     const stars = new THREE.Points(starsGeometry, starsMaterial)
//     scene.add(stars)

//     // Create an atmospheric glow using a custom shader
//     const atmosphereVertexShader = `
//       varying vec3 vNormal;
//       void main() {
//         vNormal = normalize(normalMatrix * normal);
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `
//     const atmosphereFragmentShader = `
//      uniform vec3 glowColor;
//      varying vec3 vNormal;
//      void main() {
//        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
//        gl_FragColor = vec4(glowColor, 1.0) * intensity;
//      }
//    `
//     const atmosphereGeometry = new THREE.SphereGeometry(5.2, 32, 32)
//     const atmosphereMaterial = new THREE.ShaderMaterial({
//       vertexShader: atmosphereVertexShader,
//       fragmentShader: atmosphereFragmentShader,
//       blending: THREE.AdditiveBlending,
//       side: THREE.BackSide,
//       transparent: true,
//       uniforms: {
//         glowColor: { value: new Color(0x3a86ff) },
//       },
//     })
//     const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
//     scene.add(atmosphereMesh)

//     // Create wireframe globe
//     const wireframeGeometry = new THREE.SphereGeometry(5, 32, 32)
//     const wireframeMaterial = new THREE.MeshBasicMaterial({
//       color: 0x3a86ff,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.5,
//     })
//     const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
//     scene.add(wireframeGlobe)

//     // Create solid globe (initially invisible)
//     const solidGeometry = new THREE.SphereGeometry(4.9, 64, 64)
//     const solidMaterial = new THREE.MeshPhongMaterial({
//       color: 0x1a237e,
//       transparent: true,
//       opacity: 0,
//     })
//     const solidGlobe = new THREE.Mesh(solidGeometry, solidMaterial)
//     scene.add(solidGlobe)

//     // Add ambient light
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
//     scene.add(ambientLight)

//     // Add point light
//     const pointLight = new THREE.PointLight(0xffffff, 1)
//     pointLight.position.set(10, 10, 10)
//     scene.add(pointLight)

//     camera.position.z = 10

//     const controls = new OrbitControls(camera, renderer.domElement)
//     controls.enableDamping = true
//     controls.dampingFactor = 0.05
//     controls.rotateSpeed = 0.5
//     controls.enableZoom = false

//     const colors = [
//       new Color(0x3a86ff), // Blue
//       new Color(0x8338ec), // Purple
//       new Color(0xff006e), // Pink
//       new Color(0xfb5607), // Orange
//       new Color(0xffbe0b), // Yellow
//     ]
//     let colorIndex = 0
//     let nextColorIndex = 1
//     let colorT = 0
//     const colorTransitionSpeed = 0.005

//     const lerpColor = (a: Color, b: Color, t: number) => {
//       const color = new Color()
//       color.r = a.r + (b.r - a.r) * t
//       color.g = a.g + (b.g - a.g) * t
//       color.b = a.b + (b.b - a.b) * t
//       return color
//     }

//     let animationId: number

//     const animate = () => {
//       animationId = requestAnimationFrame(animate)

//       // Color transition logic
//       colorT += colorTransitionSpeed
//       if (colorT >= 1) {
//         colorT = 0
//         colorIndex = nextColorIndex
//         nextColorIndex = (nextColorIndex + 1) % colors.length
//       }

//       const currentColor = lerpColor(colors[colorIndex], colors[nextColorIndex], colorT)

//       // Update materials with new color
//       if (wireframeGlobe.material instanceof THREE.MeshBasicMaterial) {
//         wireframeGlobe.material.color = currentColor
//       }
//       if (solidGlobe.material instanceof THREE.MeshPhongMaterial) {
//         solidGlobe.material.color = currentColor
//       }
//       if (atmosphereMesh.material instanceof THREE.ShaderMaterial) {
//         atmosphereMesh.material.uniforms.glowColor.value = currentColor
//       }

//       // Rotate the globes, atmosphere, and starfield for dynamic effect
//       wireframeGlobe.rotation.y += 0.001
//       solidGlobe.rotation.y += 0.001
//       atmosphereMesh.rotation.y += 0.0005
//       stars.rotation.y += 0.0001
//       controls.update()
//       renderer.render(scene, camera)
//     }
//     animate()

//     // Load high-resolution textures
//     const textureLoader = new THREE.TextureLoader()
//     const loadTexture = (url: string) =>
//       new Promise((resolve) => {
//         textureLoader.load(url, (texture) => resolve(texture))
//       })

//     Promise.all([
//       loadTexture("/earth-texture-compressed.jpg"),
//       loadTexture("/earth-bump-compressed.jpg"),
//       loadTexture("/earth-specular-compressed.jpg"),
//     ]).then(([texture, bumpMap, specularMap]) => {
//       const highResMaterial = new THREE.MeshPhongMaterial({
//         map: texture as THREE.Texture,
//         bumpMap: bumpMap as THREE.Texture,
//         bumpScale: 0.05,
//         specularMap: specularMap as THREE.Texture,
//         specular: new THREE.Color("grey"),
//       })

//       // Transition to the high-res textured globe
//       const transitionDuration = 1 // seconds
//       const startTime = Date.now()

//       const transitionToHighRes = () => {
//         const elapsedTime = (Date.now() - startTime) / 1000
//         const progress = Math.min(elapsedTime / transitionDuration, 1)

//         solidGlobe.material = highResMaterial
//         solidGlobe.material.opacity = progress
//         wireframeMaterial.opacity = 0.5 * (1 - progress)

//         if (progress < 1) {
//           requestAnimationFrame(transitionToHighRes)
//         } else {
//           setIsHighResLoaded(true)
//           scene.remove(wireframeGlobe)
//         }
//         renderer.render(scene, camera)
//       }

//       transitionToHighRes()
//     })

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(window.innerWidth, window.innerHeight)
//     }
//     window.addEventListener("resize", handleResize)

//     const hintTimer = setTimeout(() => {
//       setShowHint(false)
//     }, 3000) // Hide hint after 3 seconds

//     return () => {
//       window.removeEventListener("resize", handleResize)
//       cancelAnimationFrame(animationId)
//       mountRef.current?.removeChild(renderer.domElement)
//       controls.dispose()
//       clearTimeout(hintTimer)
//     }
//   }, [])

//   return (
//     <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0">
//       {showHint && (
//         <div className="absolute bottom-4 right-4 bg-black bg-opacity-30 text-white text-sm px-3 py-1 rounded-full transition-opacity duration-1000 opacity-80 hover:opacity-100">
//           Drag to explore
//         </div>
//       )}
//     </div>
//   )
// }
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Color } from "three";

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1) Scene, camera, renderer
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    const palette = [
      new Color(0x3a86ff),
      new Color(0x8338ec),
      new Color(0xff006e),
      new Color(0xfb5607),
      new Color(0xffbe0b)
    ];
    let ci = 0, ni = 1, t = 0;
    const speed = 0.005;
    const lerpColor = (a: Color, b: Color, f: number) =>
      new Color(a.r + (b.r - a.r) * f, a.g + (b.g - a.g) * f, a.b + (b.b - a.b) * f);

    // 8) Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotate
      wireMesh.rotation.y  += 0.002;
      solidMesh.rotation.y += 0.002;
      atmMesh.rotation.y   += 0.001;
      stars.rotation.y     += 0.0005;

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

    // // 9) Load textures
    // const loader = new THREE.TextureLoader();
    // Promise.all([
    //   loader.loadAsync("/earth-texture-compressed.jpg"),
    //   loader.loadAsync("/earth-bump-compressed.jpg"),
    //   loader.loadAsync("/earth-specular-compressed.jpg")
    // ])
    //   .then(([map, bumpMap, specMap]) => {
    //     const hiMat = new THREE.MeshPhongMaterial({
    //       map,
    //       bumpMap,
    //       bumpScale: 0.05,
    //       specularMap: specMap,
    //       specular: new Color("grey"),
    //       transparent: true
    //     });
    //     const start = performance.now();
    //     const duration = 1000;
    //     const step = () => {
    //       const f = Math.min((performance.now() - start) / duration, 1);
    //       solidMesh.material = hiMat;
    //       (solidMesh.material as THREE.MeshPhongMaterial).opacity = f;
    //       wireMat.opacity = 0.5 * (1 - f);
    //       if (f < 1) requestAnimationFrame(step);
    //       else scene.remove(wireMesh);
    //     };
    //     step();
    //   })
    //   .catch((err) => {
    //     console.warn("Texture load failed", err);
    //   });

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
          const mat = mesh.material as any;
          if (mat.map) mat.map.dispose();
          mat.dispose();
        }
      });
      renderer.dispose();

      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0" />;
}
