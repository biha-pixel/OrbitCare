import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const directory = "artifacts/cinematic-release";
const base = process.env.ORBITCARE_VERIFY_URL;
await mkdir(directory, { recursive: true });
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const targets = [
  ["/sw.js", "out/sw.js", "preview-sw.js"],
  ["/demo/OrbitCare-demo.mp4", "public/demo/OrbitCare-demo.mp4", "preview-demo.mp4"],
  ["/demo/OrbitCare-seven-slides.pdf", "public/demo/OrbitCare-seven-slides.pdf", "preview-slides.pdf"],
  ...(base ? [["/demo/", "public/demo/index.html"], ["/demo/slides.html", "public/demo/slides.html"], ["/demo/poster.png", "public/demo/poster.png"], ["/research/OSD-575-original.csv", "public/research/OSD-575-original.csv"]] : []),
];
const assets = [];
for (const [route, local, saved] of targets) {
  const expected = await readFile(local);
  let actual;
  if (base) {
    const response = await fetch(new URL(route, base));
    if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
    actual = Buffer.from(await response.arrayBuffer());
  } else actual = await readFile(`${directory}/${saved}`);
  if (sha(actual) !== sha(expected)) throw new Error(`${route}: mismatched local and deployed bytes`);
  assets.push({ route, bytes: actual.length, sha256: sha(actual), matchesLocal: true });
}
const html = base ? await (await fetch(base)).text() : await readFile(`${directory}/preview.html`, "utf8");
for (const marker of ["Explore Mission Demo", "behind the mission.", "Help a crewmate", "Mission Decision Replay"]) if (!html.includes(marker)) throw new Error(`Missing app marker: ${marker}`);
const protectedPaths = ["lib/analysis.ts", "lib/types.ts", "lib/validation.ts", "lib/persistence.ts", "lib/crew-incident.ts", "lib/crew-persistence.ts", "lib/use-offline.ts", "data", "public/research", "app/brand-mark.css", "components/brand-mark.tsx", "scripts/generate-sw.mjs", "package.json", "package-lock.json", "LICENSE"];
const diff = execFileSync("git", ["diff", "--numstat", "--", ...protectedPaths], { encoding: "utf8" }).trim();
if (diff) throw new Error("Protected calculation, data, storage, schema, logo, dependency or license files changed.");
const result = { verifiedAt: new Date().toISOString(), source: base || "authenticated protected preview", assets, applicationMarkersPresent: true, protectedFilesUnchanged: true };
await writeFile(`${directory}/${base ? "public" : "preview"}-verification.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
