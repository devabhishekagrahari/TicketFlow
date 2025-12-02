import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "..", "dist", "frontend"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});