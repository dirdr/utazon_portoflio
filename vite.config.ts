import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { seoPlugin } from "./scripts/seo-plugin";

export default defineConfig({
  define: {
    // Inject build timestamp for cache busting translations
    "import.meta.env.VITE_BUILD_TIME": JSON.stringify(Date.now().toString()),
  },
  plugins: [tailwindcss(), react(), seoPlugin()],
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.eot"],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.name?.endsWith(".woff2") ||
            assetInfo.name?.endsWith(".woff")
          ) {
            return "fonts/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/")
          )
            return "vendor";
          if (id.includes("node_modules/framer-motion/")) return "framer";
          if (
            id.includes("node_modules/wouter/") ||
            id.includes("node_modules/zustand/")
          )
            return "ui";
          if (
            id.includes("node_modules/i18next") ||
            id.includes("node_modules/react-i18next/")
          )
            return "i18n";
          if (id.includes("node_modules/react-player/")) return "player";
          if (id.includes("node_modules/react-intersection-observer/"))
            return "intersection";
          if (id.includes("node_modules/lenis/")) return "lenis";
          if (id.includes("node_modules/three/")) return "three";
          if (id.includes("node_modules/postprocessing/"))
            return "postprocessing";
        },
      },
    },
  },
});
