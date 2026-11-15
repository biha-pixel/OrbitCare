import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const directory='artifacts/presentation/encoded-frames';
await mkdir(directory,{recursive:true});
const times=[1,3.8,6.5,8.7,10.2,11.8,12,12.5,13,13.1,13.2,13.5,14,14.8,17.5,21,24,26.5];
for(const time of times){
  const result=spawnSync('ffmpeg',['-y','-loglevel','error','-ss',String(time),'-i','public/demo/OrbitCare-demo.mp4','-frames:v','1',`${directory}/at-${time}.png`],{encoding:'utf8'});
  if(result.status!==0)throw new Error(result.stderr);
}
const result={times,sha256:createHash('sha256').update(await readFile('public/demo/OrbitCare-demo.mp4')).digest('hex')};
await writeFile(`${directory}/verification.json`,JSON.stringify(result,null,2));
console.log('Extracted actual encoded frames across every scene, the 12–14-second explanation transition, and offline action.');
