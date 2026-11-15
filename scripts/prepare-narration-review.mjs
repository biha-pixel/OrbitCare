import { copyFile, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';

// A media-only review bundle is isolated. --additive-app copies the existing
// production artifact and proves that adding review assets changes no old file.
const additive = process.argv.includes('--additive-app');
const workspace = resolve('.');
const target = resolve(additive ? 'artifacts/narrated-app-publication' : 'artifacts/narrated-publication');
const within = relative(workspace, target);
if (!within || within.startsWith('..') || isAbsolute(within)) throw new Error('Publication artifact must stay in this workspace.');
const staticRoot = resolve(target, '.vercel/output/static');
await mkdir(resolve(staticRoot, 'demo'), { recursive: true });
async function inventory(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await inventory(resolve(directory, entry.name), name + '/'));
    else { const bytes = await readFile(resolve(directory, entry.name)); result.push({ path: '/' + name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }); }
  }
  return result;
}
const originals = additive ? await inventory(resolve('.vercel/output/static')) : [];
if (additive) await cp(resolve('.vercel/output/static'), staticRoot, { recursive: true });
const files = ['narrated-review.html', 'OrbitCare-demo-narrated.mp4', 'OrbitCare-demo.mp4', 'OrbitCare-narration.vtt', 'OrbitCare-audio-credits.txt', 'poster.png'];
const manifest = [];
for (const file of files) {
  const source = resolve('public/demo', file);
  const bytes = await readFile(source);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (file === 'OrbitCare-demo.mp4' && sha256 !== '8f18b1951d0e81b210ddab8540d4fc77212abd78f7cbb16f1407dc92146d6ef8') throw new Error('Silent fallback differs from the verified original.');
  if (file === 'OrbitCare-demo-narrated.mp4' && sha256 !== 'b3acec8a2704efe280f5bc5a6f4263d3350f234821a103f9fb5a26a259db0309') throw new Error('Narrated candidate differs from the verified output.');
  await copyFile(source, resolve(staticRoot, 'demo', file));
  manifest.push({ path: `/demo/${file}`, bytes: bytes.length, sha256 });
}
const linked = JSON.parse(await readFile('.vercel/project.json', 'utf8'));
await writeFile(resolve(target, '.vercel/project.json'), JSON.stringify({ projectId: linked.projectId, orgId: linked.orgId, projectName: linked.projectName }, null, 2));
const mediaConfig = { version: 3, routes: [
  { src: '/', status: 307, headers: { Location: '/demo/narrated-review.html' } },
  { src: '/(.*)', headers: { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' }, continue: true },
  { handle: 'filesystem' },
] };
const config = additive ? JSON.parse(await readFile('.vercel/output/config.json', 'utf8')) : mediaConfig;
await writeFile(resolve(target, '.vercel/output/config.json'), JSON.stringify(config, null, 2));
for (const file of originals) {
  const current = createHash('sha256').update(await readFile(resolve(staticRoot, '.' + file.path))).digest('hex');
  if (current !== file.sha256) throw new Error('Existing production file changed: ' + file.path);
}
await writeFile(resolve(target, 'manifest.json'), JSON.stringify({ mediaOnly: !additive, originalDemoReplacement: false, files: manifest, originalFiles: originals }, null, 2));
console.log(JSON.stringify({ target, reviewAssets: manifest.length, preservedOriginalFiles: originals.length, bytes: manifest.reduce((sum, file) => sum + file.bytes, 0), instruction: additive ? 'Verify every original file against the live site before deploying this additive bundle. The official silent MP4 remains unchanged.' : 'Deploy with --prebuilt --prod --skip-domain. Assign only a separate review alias; never promote this media-only deployment onto the application domain.' }, null, 2));
