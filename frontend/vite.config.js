import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: "esbuild", // use esbuild instead of terser
    sourcemap: false, // saves memory
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // split big deps
        },
      },
    },
  },
});
