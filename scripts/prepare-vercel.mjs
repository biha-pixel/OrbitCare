import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";

// Package the already-built static artifact; no hosting-side Node runtime is needed.
const workspace = resolve(".");
const output = resolve(".vercel/output");
const destination = resolve(output, "static");
const within = relative(workspace, destination);
if (!within || within.startsWith("..") || isAbsolute(within)) throw new Error("Deployment target must remain inside this workspace.");
await readFile("out/sw.js"); // Refuse to package an unprepared/non-production build.
await rm(destination, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// CLI build metadata is not part of Build Output API. A previous CLI build may
// have failed before running our build (for example on a hosting Node preset).
await rm(resolve(output, "builds.json"), { force: true });
await cp("out", destination, { recursive: true });
const config = { version: 3, routes: [
  { src: "/sw\\.js", headers: { "Cache-Control": "no-cache, no-store, must-revalidate", "Service-Worker-Allowed": "/" }, continue: true },
  { src: "/(.*)", headers: { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" }, continue: true },
  { handle: "filesystem" },
  { src: "/", dest: "/index.html" },
  { src: "/.*", dest: "/404.html", status: 404 },
] };
await writeFile(resolve(output, "config.json"), JSON.stringify(config, null, 2));
console.log("Prepared Vercel Build Output API v3 static artifact. Deploy with vercel deploy --prebuilt --prod.");
