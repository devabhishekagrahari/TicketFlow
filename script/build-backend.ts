import { build as esbuild } from "esbuild";
import { rm, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Server deps to bundle to reduce openat(2) syscalls
const allowlist = [
  "@google/generative-ai",
  "@neondatabase/serverless",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildBackend() {
  console.log("Building backend...");

  // Clean previous build
  const distPath = path.resolve(rootDir, "dist", "backend");
  await rm(distPath, { recursive: true, force: true });

  // Read package.json to determine externals
  const pkgPath = path.resolve(rootDir, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  // Build server
  await esbuild({
    entryPoints: [path.resolve(rootDir, "server", "index.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.resolve(distPath, "index.cjs"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log(`✅ Backend built successfully to ${distPath}`);
}

buildBackend().catch((err) => {
  console.error("❌ Backend build failed:", err);
  process.exit(1);
});

