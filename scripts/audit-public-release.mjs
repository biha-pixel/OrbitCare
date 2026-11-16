// Read-only inventory and supplemental pattern scan. Never prints matched values.
// Use Gitleaks as well; this is not a replacement for a dedicated secret scanner.
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const git = (...args) => execFileSync("git", args, { maxBuffer: 128 * 1024 * 1024, stdio: ["pipe", "pipe", "pipe"] });
const list = bytes => bytes.toString("utf8").split("\0").filter(Boolean);
const tracked = list(git("ls-files", "-z"));
const untracked = list(git("ls-files", "--others", "--exclude-standard", "-z"));
const ignored = list(git("ls-files", "--others", "--ignored", "--exclude-standard", "-z"));
const patterns = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
  ["cloud-access-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["service-token", /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{32,}|xox[baprs]-[A-Za-z0-9-]{20,}|AIza[A-Za-z0-9_-]{35})\b/g],
  ["credential-url", /[a-z][a-z0-9+.-]*:\/\/[^\s/@:]+:[^\s/@]+@/gi],
  ["jwt", /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{16,}\b/g],
  ["absolute-personal-path", /(?:[A-Z]:[\\/](?:Users|Documents and Settings)[\\/][^\s"'<>]+|\/(?:Users|home)\/[^\s"'<>]+)/gi],
  ["email-address", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi],
];
const findings = [];
let binaryBlobs = 0;
let scannedTextBlobs = 0;
function scan(bytes, location) {
  if (bytes.subarray(0, 8192).includes(0)) { binaryBlobs++; return; }
  scannedTextBlobs++;
  const text = bytes.toString("utf8");
  for (const [rule, pattern] of patterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) findings.push({ rule, location, line: text.slice(0, match.index).split("\n").length });
  }
}
const objects = git("rev-list", "--objects", "--all", "--reflog").toString("utf8").trim().split("\n");
let historyBlobs = 0;
for (const object of objects) {
  const split = object.indexOf(" ");
  if (split < 0) continue;
  const oid = object.slice(0, split);
  const name = object.slice(split + 1);
  if (git("cat-file", "-t", oid).toString().trim() !== "blob") continue;
  historyBlobs++;
  scan(git("cat-file", "blob", oid), { scope: "history", oid, path: name });
}
for (const file of [...tracked, ...untracked]) scan(readFileSync(file), { scope: "working-tree", path: file });
// Examine small local configuration files as well without publishing their contents.
const localConfigs = ignored.filter(p => /(?:^|\/)(?:\.env[^/]*|\.npmrc|\.netrc|credentials[^/]*|[^/]+\.(?:pem|key|p12|pfx))$/.test(p) || /^\.vercel\/[^/]+\.json$/.test(p));
for (const file of localConfigs) if (statSync(file).size < 2 * 1024 * 1024) scan(readFileSync(file), { scope: "ignored-local-config", path: file });
const sensitiveNames = paths => paths.filter(p => /(?:^|\/)(?:\.env[^/]*|\.npmrc|\.netrc|credentials[^/]*|[^/]+\.(?:pem|key|p12|pfx|log|bak|bundle))$/.test(p));
const inventory = tracked.map(path => ({ path, bytes: statSync(path).size, sha256: createHash("sha256").update(readFileSync(path)).digest("hex") }));
const report = {
  generatedAt: new Date().toISOString(), revision: git("rev-parse", "HEAD").toString().trim(),
  coverage: { trackedFiles: tracked.length, untrackedReleaseFiles: untracked.length, commitsAllRefsAndReflogs: Number(git("rev-list", "--all", "--reflog", "--count").toString()), historyBlobs, scannedTextBlobs, binaryBlobsSkipped: binaryBlobs, ignoredLocalConfigsChecked: localConfigs.length },
  trackedSensitiveNames: sensitiveNames(tracked), historySensitiveNames: sensitiveNames(objects.map(o => o.slice(o.indexOf(" ") + 1))),
  ignoredFileCount: ignored.length, ignoredTopLevel: [...new Set(ignored.map(p => p.split("/")[0]))],
  findings, largestTrackedFiles: [...inventory].sort((a, b) => b.bytes - a.bytes).slice(0, 15), inventory,
  limitations: ["Patterns are heuristic; dedicated Gitleaks scans are required separately.", "Binary contents, image pixels/audio, arbitrary ignored logs and dependency caches are not fully secret-scanned.", "Remote-only/deleted unreachable objects and remote service account settings are outside local coverage.", "Git author/committer email metadata is inventoried separately, not rewritten."],
};
mkdirSync("artifacts/release-audit", { recursive: true });
writeFileSync("artifacts/release-audit/repository-inventory.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ coverage: report.coverage, trackedSensitiveNames: report.trackedSensitiveNames, historySensitiveNames: report.historySensitiveNames, largestTrackedFiles: report.largestTrackedFiles.map(({ path, bytes }) => ({ path, bytes })), findingCounts: Object.fromEntries(patterns.map(([rule]) => [rule, findings.filter(f => f.rule === rule).length])) }, null, 2));
