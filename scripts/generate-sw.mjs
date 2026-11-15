import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!(directory === "out" && entry.name === "demo")) files.push(...await walk(path));
    } else if (entry.name !== "sw.js" && !entry.name.endsWith(".map")) files.push(path);
  }
  return files.sort();
}
const files = await walk("out");
const hash = createHash("sha256");
let total = 0;
for (const file of files) { const bytes = await readFile(file); hash.update(file); hash.update(bytes); total += bytes.length; }
const version = hash.digest("hex").slice(0, 16);
const assets = files.map(file => "/" + relative("out", file).replaceAll("\\", "/"));
assets.push("/");
const source = `/* Generated from the production artifact. No personal data is cached here. */
const CACHE = 'orbitcare-assets-${version}';
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); });
self.addEventListener('activate', event => { event.waitUntil((async () => { for (const key of await caches.keys()) if (key.startsWith('orbitcare-assets-') && key !== CACHE) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
  if (event.data?.type === 'CHECK_READY') event.waitUntil((async () => { const cache = await caches.open(CACHE); const matches = await Promise.all(ASSETS.map(asset => cache.match(asset))); event.ports[0]?.postMessage({ ready: matches.every(Boolean), version: '${version}', assets: ASSETS.length }); })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate' && url.pathname !== '/' && url.pathname !== '/index.html') return;
  event.respondWith((async () => { const cache = await caches.open(CACHE); const cached = await cache.match(event.request.mode === 'navigate' ? '/' : event.request); if (cached) return cached; return fetch(event.request); })());
});\n`;
await writeFile("out/sw.js", source);
console.log(`Offline manifest ${version}: ${assets.length} assets, ${(total / 1024 / 1024).toFixed(2)} MiB.`);
