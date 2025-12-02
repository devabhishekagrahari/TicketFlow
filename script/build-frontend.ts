import { build as viteBuild } from "vite";
import { rm } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function buildFrontend() {
  console.log("Building frontend...");
  
  // Clean previous build
  const distPath = path.resolve(rootDir, "dist", "frontend");
  await rm(distPath, { recursive: true, force: true });

  // Build with Vite
  await viteBuild({
    configFile: path.resolve(rootDir, "vite.config.ts"),
    build: {
      outDir: distPath,
      emptyOutDir: true,
    },
  });

  console.log(`✅ Frontend built successfully to ${distPath}`);
}

buildFrontend().catch((err) => {
  console.error("❌ Frontend build failed:", err);
  process.exit(1);
});

