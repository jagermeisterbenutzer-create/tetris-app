import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const buildDir = path.join(rootDir, "build");

await rm(buildDir, { recursive: true, force: true });
await mkdir(buildDir, { recursive: true });

await cp(path.join(rootDir, "public"), buildDir, { recursive: true });
await cp(path.join(rootDir, "dist"), path.join(buildDir, "dist"), { recursive: true });
