import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const directory='artifacts/judge-final';
const base=process.env.ORBITCARE_VERIFY_URL;
await mkdir(directory,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const targets=[
  {route:'/sw.js',local:'out/sw.js',preview:'preview-sw.js'},
  {route:'/demo/OrbitCare-demo.mp4',local:'public/demo/OrbitCare-demo.mp4',preview:'preview-demo.mp4'},
  {route:'/demo/OrbitCare-seven-slides.pdf',local:'public/demo/OrbitCare-seven-slides.pdf',preview:'preview-slides.pdf'},
];
const assets=[];
for(const target of targets){
  const expected=await readFile(target.local);
  let actual;
  if(base){
    const response=await fetch(new URL(target.route,base));
    if(!response.ok)throw new Error(`${target.route}: HTTP ${response.status}`);
    actual=Buffer.from(await response.arrayBuffer());
  }else actual=await readFile(`${directory}/${target.preview}`);
  if(sha(actual)!==sha(expected))throw new Error(`${target.route}: mismatched bytes`);
  assets.push({route:target.route,bytes:actual.length,sha256:sha(actual),matchesLocal:true});
}
const html=base?await (await fetch(base)).text():await readFile(`${directory}/preview.html`,'utf8');
for(const marker of ['Mission Decision Replay','Investigate the change','M0 14h7l3-3 3 3h4l3-11 4 22 4-14 3 3h11'])if(!html.includes(marker))throw new Error(`Application marker missing: ${marker}`);
const protectedPaths=['app/brand-mark.css','components/brand-mark.tsx','lib/analysis.ts','lib/types.ts','lib/validation.ts','lib/persistence.ts','lib/use-offline.ts','data/scenarios.ts','data/raw','data/research.json','public/research','scripts/generate-sw.mjs'];
const diff=execFileSync('git',['diff','--numstat','--',...protectedPaths],{encoding:'utf8'}).trim();
if(diff)throw new Error('Protected algorithm, data, storage or original logo files differ from the starting revision.');
const result={verifiedAt:new Date().toISOString(),source:base||'authenticated protected preview',assets,applicationMarkersPresent:true,originalLogoRestored:true,protectedFilesUnchanged:true};
await writeFile(`${directory}/${base?'public':'preview'}-verification.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
