import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const directory = "artifacts/presentation";
const capture = JSON.parse(await readFile(`${directory}/capture.json`, "utf8"));
await mkdir(`${directory}/frames`, { recursive: true });
await mkdir(`${directory}/clips`, { recursive: true });
await mkdir("public/demo", { recursive: true });
let fonts = "";
for (const weight of [400,500,600]) fonts += `@font-face{font-family:Plex;src:url(data:font/woff2;base64,${(await readFile(`node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-${weight}-normal.woff2`)).toString("base64")});font-weight:${weight}}`;
const logo = (await readFile("public/icon.svg", "utf8")).replace(/<\?xml[^>]*>/, "");
const encoded = {};
const dimensions = {};
for (const [name, path] of Object.entries(capture.assets)) { const bytes = await readFile(path); encoded[name] = `data:image/png;base64,${bytes.toString("base64")}`; dimensions[name] = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }; }
const image = (name, x, y, width, height, extra = "") => { const source = dimensions[name]; const scale = Math.min(width / source.width, height / source.height); const w = source.width * scale; const h = source.height * scale; return `<img class="shot ${extra}" alt="Actual OrbitCare ${name.replaceAll("-", " ")} capture" src="${encoded[name]}" style="left:${x + (width - w) / 2}px;top:${y + (height - h) / 2}px;width:${w}px;height:${h}px">`; };
const text = (content, x, y, width, size = 30, extra = "") => `<div class="copy ${extra}" style="left:${x}px;top:${y}px;width:${width}px;font-size:${size}px">${content.replaceAll("Sodium (mmol/L) ? ground sampling visits", "Sodium (mmol/L) · ground sampling visits")}</div>`;
const css = `${fonts}
@page{size:1920px 1080px;margin:0}*{box-sizing:border-box}html,body{margin:0;font-family:Plex,sans-serif;color:#182b3a}body{background:#f5f7f6}.frame{position:relative;width:1920px;height:1080px;overflow:hidden;background:#f5f7f6;break-after:page}.frame:last-child{break-after:auto}.frame.dark{background:#122235;color:#fff}.brandline{position:absolute;left:78px;right:78px;top:48px;display:flex;align-items:center;gap:13px;font-size:30px;font-weight:500}.brandline svg{width:45px;height:45px}.brandline .context{margin-left:auto;color:#526861;font-size:20px;font-weight:400}.dark .brandline .context{color:#b8cbd2}.chapter{position:absolute;left:80px;top:130px;font-size:21px;color:#007f78}.dark .chapter{color:#a6decc}.copy{position:absolute;line-height:1.5;white-space:normal}.hero{font-weight:500;letter-spacing:-2.3px;line-height:1.08}.soft{color:#526861}.dark .soft{color:#bed1d8}.accent{color:#007f78}.dark .accent{color:#b8ead8}.shot{position:absolute;display:block;object-fit:contain;object-position:left top;border-radius:10px}.bordered{border:1px solid #d8e3dc;background:#fff}.picture-panel{position:absolute;border:1px solid #d9e3dd;border-radius:15px;background:#fff;overflow:hidden}.dark-panel{position:absolute;background:#122235;border-radius:16px;color:white}.footer{position:absolute;left:80px;right:80px;bottom:34px;border-top:1px solid #d9e2dd;padding-top:17px;display:flex;justify-content:space-between;gap:30px;font-size:19px;color:#526861}.dark .footer{border-color:#3b5060;color:#b9ccd2}.rulebar{border-left:4px solid #c5944d;padding-left:23px}.workflow-steps{position:absolute;left:80px;right:80px;top:741px;display:grid;grid-template-columns:repeat(4,1fr);gap:32px}.workflow-steps>div{font-size:31px;line-height:1.4;border-top:3px solid #afcfc0;padding-top:19px}.workflow-steps small{display:block;font-size:20px;color:#007f78;margin-bottom:10px}.number{font-variant-numeric:tabular-nums}.facts{line-height:1.8}.website{font-weight:500;letter-spacing:-1px}.divider{position:absolute;height:1px;background:#d6e2db}.dark .divider{background:#3b5060}`;
function frame(chapter, body, { dark = false, index = "", source = "Synthetic monitoring · prototype engineering rules" } = {}) {
  return `<section class="frame ${dark ? "dark" : ""}"><div class="brandline">${logo}<span>OrbitCare</span><span class="context">Astronaut self-monitoring · Research prototype</span></div><div class="chapter">${chapter}</div>${body}<footer class="footer"><span>${source}</span><span>${index}</span></footer></section>`;
}
const problem = text("Health changes<br>need personal<br>context.",80,220,800,94,"hero") + text("Understand what changed—and keep a review record without continuous connectivity.",84,605,710,32,"soft") + image("change-record",920,220,925,690,"bordered");
const slides = [
  frame("01 / Problem and challenge", problem + text("NASA Space Apps 2026<br>Bihandu Liyanage · Anuradhapura virtual participant",84,827,770,24,"soft"), { dark: true, index: "1 / 7" }),
  frame("02 / The OrbitCare solution", text("A complete monitoring-to-review loop.",80,197,1730,76,"hero") + text("Observe → Compare → Explain → Record · Continue offline after preparation",84,307,1710,30,"soft") + image("change-brief",80,400,1760,260) + `<div class="workflow-steps"><div><small>01</small>Record a<br>check-in</div><div><small>02</small>Compare with<br>your reference</div><div><small>03</small>Inspect the rule<br>and evidence</div><div><small>04</small>Keep a local<br>review record</div></div>`, { index: "2 / 7" }),
  frame("03 / Personalized baseline monitoring", text("Your own reference.<br>A clearer comparison.",80,202,790,74,"hero") + text("Fixed days 01–14.<br>Original units. Visible data gaps.",84,425,730,31,"soft") + image("coverage",84,580,730,48) + image("comparison",84,659,730,205) + image("difference",84,885,730,70) + image("change-record",925,225,920,690,"bordered"), { index: "3 / 7" }),
  frame("04 / Explainable health review", text("Explain the flag.<br>Keep the review inspectable.",80,200,1730,75,"hero") + image("persistence",80,426,830,230,"bordered") + image("rule-body",80,683,830,300,"bordered") + text("A local review record",1050,427,760,30,"soft") + image("persisted-review",1050,492,760,460,"bordered"), { index: "4 / 7" }),
  frame("05 / Offline mission operation", text("The connection can drop.<br>The review can continue.",80,203,1730,76,"hero") + image("offline-status",84,429,770,58) + text("Prepared online.<br>Reopened offline.<br>Review saved and reopened again.",84,542,760,34,"facts") + text("Local record only. No medical support<br>message is transmitted.",84,829,780,27,"soft rulebar") + image("persisted-review",1010,416,800,510,"bordered"), { index: "5 / 7" }),
  frame("06 / NASA research and scientific transparency", text("NASA research.<br>Scientific boundaries.",80,205,790,73,"hero") + text("OSD-575 · Inspiration4<br>4 participants · 7 ground visits<br>56 sodium/potassium observations",84,435,760,31,"facts") + text("Research context—not validation<br>of the monitoring thresholds.",84,705,750,33,"rulebar") + text("Sodium (mmol/L) ? ground sampling visits",940,218,910,25,"soft") + image("research-plot",927,211,925,500,"bordered") + [0,1,2,3].map((n) => image(`research-participant-${n}`,960+n*210,688,150,58)).join("") + text("Original units, coded participants and visit labels.<br>Unequal sampling intervals; no invented in-flight values.<br>Study DOI: 10.26030/mc5d-p710",940,771,910,25,"soft"), { index: "6 / 7", source: "Original NASA OSD-575 research · kept separate from synthetic monitoring" }),
  frame("07 / Mission impact, limitations and project", text("A clearer health record.<br>A reason you can inspect.",80,215,1700,82,"hero") + text("orbitcare-eight.vercel.app",84,475,1750,54,"website accent") + text("Demonstrated",84,650,770,27,"accent") + text("Personal comparisons. Explainable persistence.<br>Verified offline reopening and local review.",84,706,830,30) + text("Still requires evaluation",1060,650,760,27,"accent") + text("Clinical validation and astronaut usability.<br>Not a diagnosis, treatment or flight-certified system.",1060,706,770,30) + text("Participant-led concept · AI-assisted implementation disclosed · No NASA endorsement",84,900,1730,24,"soft"), { dark: true, index: "7 / 7", source: "OrbitCare · Bihandu Liyanage · NASA Space Apps 2026" }),
];
const metricBoard = prefix => `<div class="dark-panel" style="left:80px;top:350px;width:1760px;height:480px"></div>` + [0,1,2].map((value,index) => image(`${prefix}-metric-${value}`,155 + index * 550,397,500,350)).join("");
const videoFrames = [
  frame("Personalized monitoring. Transparent review.", text("Personal health<br>changes, explained.",80,240,850,82,"hero") + text("An astronaut's reference.<br>An explanation they can inspect.",84,565,740,34,"soft") + image("stable-record",960,219,870,687,"bordered"), { dark: true }),
  frame("Notice / Stable scenario", text("Start with the personal reference.",80,203,1740,76,"hero") + metricBoard("stable") + text("Mission day 24 · Fixed reference days 01–14 · Synthetic measurements",110,891,1660,29,"soft")),
  frame("Notice / Sustained-change scenario", text("Now the personal pattern changes.",80,203,1740,76,"hero") + metricBoard("change") + text("Three indicators now meet the sustained-change rule. Inspect why.",110,891,1660,29,"soft")),
  frame("Explain / The observed difference", text("What changed?",80,208,1740,80,"hero") + text("A personal reference.<br>The selected reading.<br>The difference in original units.",84,399,755,42,"facts") + image("comparison",970,350,850,239,"bordered") + image("difference",970,630,850,95) + image("coverage",970,761,850,43)),
  frame("Explain / The persistence rule", text("Why was review suggested?",80,202,1760,76,"hero") + text("Three consecutive<br>changed days.",84,410,720,61,"hero") + text("Inspectable rules.<br>Visible engineering assumptions.<br>No diagnostic claim.",84,654,720,31,"soft facts") + image("persistence",970,369,850,220,"bordered") + image("rule-body",970,626,850,355,"bordered")),
  frame("Evidence / A separate research view", text("Real NASA observations.<br>A different purpose.",80,206,810,69,"hero") + text("OSD-575 · Inspiration4<br>Four participants. Seven ground visits.<br>Original values and units preserved.",84,438,770,30,"facts") + text("Research context, not validation<br>of prototype monitoring thresholds.",84,766,790,29,"soft rulebar") + text("Sodium (mmol/L) ? ground sampling visits",950,267,900,25,"soft") + image("research-plot",936,257,925,515,"bordered") + [0,1,2,3].map((n) => image(`research-participant-${n}`,965+n*210,795,150,58)).join(""), { source: "Original NASA OSD-575 observations · separate from simulated monitoring" }),
  frame("Continue / Actual browser network disconnection", text("Disconnected.<br>Review continues.",80,213,830,78,"hero") + image("offline-status",84,455,780,62) + text("Reopened offline.<br>Record the action locally.<br>Nothing sent to medical support.",84,600,820,34,"facts") + `<div class="picture-panel" style="left:1040px;top:292px;width:800px;height:660px"></div>`),
  frame("OrbitCare / Notice. Explain. Review.", text("Keep the context.<br>Keep the review.",80,225,840,87,"hero") + text("orbitcare-eight.vercel.app",84,514,870,43,"website accent") + text("Review persisted after another offline reload.",84,659,830,29,"soft") + image("persisted-review",1030,300,780,585,"bordered") + text("Research prototype · not a medical or flight-certified system",84,885,1750,26,"soft"), { dark: true, source: "AI-assisted development · actual application captures · no NASA endorsement" }),
];
const html = content => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OrbitCare — final presentation</title><style>${css}</style></head><body>${content}</body></html>`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.setContent(html(slides.join("")), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "public/demo/OrbitCare-seven-slides.pdf", printBackground: true, preferCSSPageSize: true });
  await writeFile("public/demo/slides.html", html(slides.join("")));
  for (let index = 0; index < slides.length; index++) await page.locator(".frame").nth(index).screenshot({ path: `${directory}/frames/slide-${index + 1}.png` });
  await page.emulateMedia({ media: "screen" });
  for (let index = 0; index < videoFrames.length; index++) {
    await page.setContent(html(videoFrames[index]), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${directory}/frames/video-${index}.png` });
  }
} finally { await browser.close(); }

function run(args) {
  const result = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
}
const planned = [3,2,3,3.5,3.5,4,6,3];
const transition = .2;
for (let index = 0; index < videoFrames.length; index++) {
  const duration = planned[index] + (index < videoFrames.length - 1 ? transition : 0);
  const path = `${directory}/clips/scene-${index}.mp4`;
  if (index === 6) {
    const box = capture.action.box;
    const crop = `${Math.floor(box.width / 2) * 2}:${Math.floor(box.height / 2) * 2}:${Math.floor(box.x / 2) * 2}:${Math.floor(box.y / 2) * 2}`;
    run(["-loop","1","-framerate","30","-i",`${directory}/frames/video-${index}.png`,"-ss",String(capture.action.start),"-t",String(capture.action.duration),"-i",capture.action.sourceVideo,"-filter_complex_threads","1","-filter_complex",`[1:v]crop=${crop},fps=30,setpts=PTS-STARTPTS,scale=800:660:force_original_aspect_ratio=decrease,pad=800:660:(ow-iw)/2:(oh-ih)/2:white,tpad=stop_mode=clone:stop_duration=2[v];[0:v][v]overlay=1040:292:shortest=1,format=yuv420p[out]`,"-map","[out]","-t",String(duration),"-c:v","libx264","-preset","fast","-crf","19","-pix_fmt","yuv420p","-an",path]);
  } else run(["-loop","1","-framerate","30","-i",`${directory}/frames/video-${index}.png`,"-t",String(duration),"-c:v","libx264","-preset","fast","-crf","19","-pix_fmt","yuv420p","-an",path]);
}
const inputs = videoFrames.flatMap((_, index) => ["-i",`${directory}/clips/scene-${index}.mp4`]);
let filter = ""; let elapsed = 0;
for (let index = 1; index < videoFrames.length; index++) {
  elapsed += planned[index - 1];
  filter += `${index > 1 ? ";" : ""}[${index === 1 ? "0:v" : `v${index - 1}`}][${index}:v]xfade=transition=fade:duration=${transition}:offset=${elapsed}[v${index}]`;
}
run([...inputs,"-filter_complex_threads","1","-filter_complex",filter,"-map","[v7]","-t","28","-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-movflags","+faststart","-an","public/demo/OrbitCare-demo.mp4"]);
const probe = spawnSync("ffprobe",["-v","error","-show_entries","format=duration,size:stream=width,height,r_frame_rate","-of","json","public/demo/OrbitCare-demo.mp4"],{encoding:"utf8"});
if (probe.status !== 0) throw new Error(probe.stderr);
const result = { ...JSON.parse(probe.stdout), slideCount: slides.length, aspectRatio: "16:9", actualAppCaptures: true, englishText: "large captions baked into each scene", generatedImagery: false, offlineProof: capture.offline, capturedAt: capture.capturedAt };
if (Number(result.format.duration) > 30) throw new Error("Demo exceeds the limit.");
await writeFile(`${directory}/verification.json`,JSON.stringify(result,null,2));
console.log(result);
