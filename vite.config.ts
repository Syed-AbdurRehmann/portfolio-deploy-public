import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");
          if (!normalizedId.includes("node_modules")) {
            return;
          }

          const packagePath = normalizedId.split("node_modules/")[1];
          if (!packagePath) {
            return;
          }

          const packageSegments = packagePath.split("/");
          const packageName = packageSegments[0].startsWith("@")
            ? `${packageSegments[0]}/${packageSegments[1]}`
            : packageSegments[0];

          if (
            packageName === "react" ||
            packageName === "react-dom" ||
            packageName === "react-router" ||
            packageName === "react-router-dom" ||
            packageName === "scheduler"
          ) {
            return "vendor-react";
          }

          if (packageName === "framer-motion") {
            return "vendor-motion";
          }

          if (packageName.startsWith("@radix-ui/")) {
            return "vendor-radix";
          }

          if (packageName.startsWith("@tanstack/")) {
            return "vendor-query";
          }

          if (packageName === "lucide-react") {
            return "vendor-icons";
          }

          if (packageName === "jspdf" || packageName === "html2canvas" || packageName === "dompurify") {
            return "vendor-pdf";
          }

          return `vendor-${packageName.replace("@", "").replace("/", "-")}`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
