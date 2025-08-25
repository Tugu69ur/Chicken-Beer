import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer"; // <- here

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: "stats.html" }), // generates stats.html after build
  ],
  build: {
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const chunk = id.toString().split("node_modules/")[1].split("/")[0];
            if (
              [
                "dayjs",
                "json2mq",
                "react-router-dom",
                "set-cookie-parser",
                "string-convert",
              ].includes(chunk)
            ) {
              return;
            }
            return chunk;
          }
        },
      },
    },
  },
});
