import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler") ||
              id.includes("antd") ||
              id.includes("rc-") ||
              id.includes("@ant-design") ||
              id.includes("@rc-component")
            ) {
              return "react-vendor";
            }
          }
        }
      }
    }
  }
});