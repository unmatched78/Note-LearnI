import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
// import copy from "rollup-plugin-copy";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  // copy({
  //     targets: [
  //       {
  //         // The Nutrient Web SDK requires its assets to be in the `public` directory so it can load them.
  //         src: "node_modules/@nutrient-sdk/viewer/dist/nutrient-viewer-lib",
  //         dest: "public/",
  //       },
  //     ],
  //     hook: "buildStart",
  //   })],
  ],
    optimizeDeps: {
    include: ["react-pdf", "pdfjs-dist"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
