import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
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
                "react",
                "react-dom",
                "scheduler",
                "antd",
                "@ant-design",
                "@rc-component"
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
