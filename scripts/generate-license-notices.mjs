// Inventory declarations from the lockfile; retain installed package license texts.
// This is an aid to review, not a legal determination or a complete bundle SBOM.
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const entries = Object.entries(lock.packages).filter(([path]) => path).map(([path, value]) => ({ path, version: value.version, license: value.license ?? null, developmentOnly: !!value.dev, optional: !!value.optional }));
await mkdir("docs/licenses", { recursive: true });
await writeFile("docs/licenses/dependencies.json", JSON.stringify({ source: "package-lock.json", scope: "Declared licenses for all locked package entries, including optional platform and development dependencies. Not proof of bundle inclusion or a legal opinion.", packages: entries }, null, 2) + "\n");
const texts = [];
const unavailable = [];
for (const entry of entries) {
  const directName = entry.path.replace(/^node_modules\//, "");
  if (entry.developmentOnly && !Object.hasOwn(pkg.devDependencies, directName)) continue;
  let names;
  try { names = await readdir(entry.path); } catch { unavailable.push(entry.path); continue; }
  for (const name of names.filter(name => /^(?:licen[sc]e|copying|notice)(?:\.|$)/i.test(name)).sort()) {
    try { texts.push(`===== ${entry.path}@${entry.version} / ${name} =====\n${await readFile(`${entry.path}/${name}`, "utf8")}`); } catch { /* Directory, not license text. */ }
  }
}
const notice = "OrbitCare dependency notices\n\nOriginal upstream license/copyright texts for installed production dependency entries and direct development tools. Optional packages for other platforms are not installed here; obtain their original notices with their packages. Native binaries and node_modules are not redistributed in the source release or static export. Next.js also includes separately licensed compiled components; preserve their accompanying notices if distributing that toolchain. See THIRD_PARTY_NOTICES.md and docs/licenses/dependencies.json for scope.\n\n" + texts.join("\n\n");
await writeFile("docs/licenses/npm-NOTICES.txt", notice);
await writeFile("artifacts/release-audit/license-inventory-summary.json", JSON.stringify({ packages: entries.length, missingDeclarations: entries.filter(e => !e.license), installedLicenseTexts: texts.length, optionalOrUnavailablePackages: unavailable }, null, 2));
console.log(JSON.stringify({ packages: entries.length, missingDeclarations: entries.filter(e => !e.license).length, installedLicenseTexts: texts.length, noticeBytes: Buffer.byteLength(notice) }));
