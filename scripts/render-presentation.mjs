import { chromium } from "@playwright/test";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const directory = "artifacts/presentation";
const slidesOnly = process.argv.includes("--slides-only");
const videoOnly = process.argv.includes("--video-only");
if (slidesOnly && videoOnly) throw new Error("Choose either slides-only or video-only.");
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
const text = (content, x, y, width, size = 30, extra = "") => `<div class="copy ${extra}" style="left:${x}px;top:${y}px;width:${width}px;font-size:${size}px">${content.replaceAll("\n", "<br>").replaceAll("Sodium (mmol/L) ? ground sampling visits", "Sodium (mmol/L) · ground sampling visits")}</div>`;
const css = `${fonts}
@page{size:1920px 1080px;margin:0}*{box-sizing:border-box}html,body{margin:0;font-family:Plex,sans-serif;color:#182b3a}body{background:#f5f7f6}.frame{position:relative;width:1920px;height:1080px;overflow:hidden;background:#f5f7f6;break-after:page}.frame:last-child{break-after:auto}.frame.dark{background:#122235;color:#fff}.brandline{position:absolute;left:78px;right:78px;top:48px;display:flex;align-items:center;gap:13px;font-size:30px;font-weight:500}.brandline svg{width:45px;height:45px}.brandline .context{margin-left:auto;color:#526861;font-size:20px;font-weight:400}.dark .brandline .context{color:#b8cbd2}.chapter{position:absolute;left:80px;top:130px;font-size:21px;color:#007f78}.dark .chapter{color:#a6decc}.copy{position:absolute;line-height:1.5;white-space:normal}.hero{font-weight:500;letter-spacing:-2.3px;line-height:1.08}.soft{color:#526861}.dark .soft{color:#bed1d8}.accent{color:#007f78}.dark .accent{color:#b8ead8}.shot{position:absolute;display:block;object-fit:contain;object-position:left top;border-radius:10px}.bordered{border:1px solid #d8e3dc;background:#fff}.picture-panel{position:absolute;border:1px solid #d9e3dd;border-radius:15px;background:#fff;overflow:hidden}.dark-panel{position:absolute;background:#122235;border-radius:16px;color:white}.footer{position:absolute;left:80px;right:80px;bottom:34px;border-top:1px solid #d9e2dd;padding-top:17px;display:flex;justify-content:space-between;gap:30px;font-size:19px;color:#526861}.dark .footer{border-color:#3b5060;color:#b9ccd2}.rulebar{border-left:4px solid #c5944d;padding-left:23px}.workflow-steps{position:absolute;left:80px;right:80px;top:741px;display:grid;grid-template-columns:repeat(4,1fr);gap:32px}.workflow-steps>div{font-size:31px;line-height:1.4;border-top:3px solid #afcfc0;padding-top:19px}.workflow-steps small{display:block;font-size:20px;color:#007f78;margin-bottom:10px}.number{font-variant-numeric:tabular-nums}.facts{line-height:1.8}.website{font-weight:500;letter-spacing:-1px}.divider{position:absolute;height:1px;background:#d6e2db}.dark .divider{background:#3b5060}`;
function frame(chapter, body, { dark = false, index = "", source = "Synthetic monitoring · prototype engineering rules" } = {}) {
  return `<section class="frame ${dark ? "dark" : ""}"><div class="brandline">${logo}<span>OrbitCare</span><span class="context">Astronaut self-monitoring · Research prototype</span></div><div class="chapter">${chapter}</div>${body}<footer class="footer"><span>${source}</span><span>${index}</span></footer></section>`;
}
const slides = [
  frame("01 / The problem", text("An astronaut’s readings<br>change. What now?",80,220,1740,91,"hero") + text("OrbitCare makes personal change explainable and keeps a review record when connectivity drops.",84,464,800,37,"soft") + image("change-record",970,451,870,450,"bordered") + text("Bihandu Liyanage · Nesandu Liyanage<br>NASA Space Apps 2026 team<br>Anuradhapura, Sri Lanka",84,811,860,25,"soft"), {dark:true,index:"1 / 7"}),
  frame("02 / Start with the person", text("One reference.<br>One clear change brief.",80,203,1740,76,"hero") + image("change-brief",80,424,1760,430) + text("Synthetic mission · Current readings beside days 1–14 reference · Investigate with one action",84,914,1740,28,"soft"), {index:"2 / 7"}),
  frame("03 / Mission Decision Replay", text("From a changed reading<br>to a review you can explain.",80,203,1740,76,"hero") + image("story-22",80,410,850,170,"bordered") + image("story-23",80,601,850,170,"bordered") + image("story-24",80,792,850,170,"bordered") + image("comparison",1020,418,800,220,"bordered") + image("persistence",1020,670,800,155) + image("rule-body",1020,854,800,120), {index:"3 / 7",source:"Same deterministic rules · future readings, gaps and review events stay hidden"}),
  frame("04 / Human context and boundaries", text("Explore the body.<br>Understand the limits.",80,203,1740,76,"hero") + image("body-map",80,398,680,570) + image("body-source",850,416,990,170) + image("body-limit",850,615,990,160) + text("Acute concern? Follow approved mission procedures immediately. Never wait for the trend rule.",850,824,990,30,"rulebar"), {index:"4 / 7",source:"NASA cardiovascular and sleep research informs context, not diagnostic thresholds"}),
  frame("05 / NASA data you can actually inspect", text("Original observations.<br>Explicit scientific separation.",80,203,1740,73,"hero") + text("Sodium (mmol/L) · ground sampling visits",84,388,1060,23,"soft") + image("research-plot",80,440,1060,360,"bordered") + [0,1,2,3].map(i => image(`research-participant-${i}`,90+i*260,813,230,42)).join("") + image("research-observation",80,875,1060,90) + text("OSD-575 · Inspiration4",1220,414,620,35,"accent") + text("56 sodium / potassium observations<br>4 participants · 7 ground visits<br>Original mmol/L · CSV + provenance",1220,484,620,28,"facts") + text("NASA adaptation, sleep and longitudinal research inform the monitoring context. Medical-care standards inform review boundaries.",1220,667,620,26,"soft") + text("These laboratory values do not calibrate or validate our prototype thresholds.",1220,843,620,28,"rulebar"), {index:"5 / 7",source:"OSD-575 · DOI 10.26030/mc5d-p710 · no in-flight readings invented"}),
  frame("06 / Demonstrated offline continuity", text("The connection drops.<br>The review continues.",80,203,1740,76,"hero") + image("offline-status",84,427,780,62) + text("Prepared online.<br>Reopened offline.<br>Review saved and reopened again.",84,549,800,34,"facts") + text("Local record only.<br>No message sent to medical support.",84,825,800,29,"soft") + image("persisted-review",1030,422,780,530,"bordered"), {index:"6 / 7"}),
  frame("07 / What is demonstrated; what comes next", text("Personal change.<br>Inspectable decisions.",80,210,1740,86,"hero") + text("orbitcare-eight.vercel.app",84,459,1740,52,"website accent") + text("Working prototype",84,634,790,29,"accent") + text("Deterministic replay. Research provenance.<br>Offline reopening and local review history.",84,695,830,31) + text("Still unvalidated",1040,634,790,29,"accent") + text("Clinical thresholds and accuracy.<br>Astronaut usability and operational benefit.",1040,695,800,31) + text("Research prototype · No diagnosis, treatment, organ score or flight certification",84,895,1740,27,"soft"), {dark:true,index:"7 / 7",source:"Participant-led concept · AI-assisted code and synthetic fixtures disclosed · no NASA endorsement"}),
];
const videoFrames = [
  frame("A personal change. A reason to investigate.", text("An astronaut’s<br>readings change.",80,230,850,88,"hero") + text("What changed? Why review?<br>OrbitCare makes the reasoning inspectable.",84,566,800,35,"soft") + image("change-record",970,280,870,620,"bordered"), {dark:true}),
  frame("Reference / Fixed days 1–14", text("Start with their<br>own reference.",80,220,850,83,"hero") + image("story-14",84,555,820,240,"bordered") + image("comparison",1010,365,820,300,"bordered") + text("Reference → day 24 reading<br>Original units. No hidden score.",1010,737,820,33,"soft")),
  frame("Notice / Synthetic mission day 22", text("The first changed reading.<br>Not yet a review flag.",80,210,1740,76,"hero") + image("story-22",80,443,1760,250,"bordered") + text("A single changed day does not meet the three-day persistence rule.",84,818,1740,34,"soft")),
  frame("Mission Decision Replay / Day 24 review explanation", text("Why suggest<br>a review?",80,220,830,83,"hero") + text("60 → 71 bpm<br>Three consecutive changed days.",84,540,830,39,"facts") + text("Check the calculation and measurement quality.<br>Then record an appropriate review action.",84,730,830,30,"soft") + image("review-explanation",990,200,850,770,"bordered"), {source:"Synthetic mission day 24 · Unvalidated engineering rule · Not a diagnosis"}),
  frame("NASA context / Research mapped to features", text("Research informs<br>what we record.",80,220,850,80,"hero") + text("Cardiovascular adaptation. Sleep and schedules.<br>Longitudinal observations. Medical-care boundaries.",84,570,850,32,"facts") + image("nasa-connection",1020,257,800,690,"bordered") + text("NASA research does not validate our thresholds.",84,872,850,27,"soft")),
  frame("NASA measurements / OSD-575", text("Real laboratory data.<br>Kept scientifically separate.",80,205,1740,73,"hero") + text("Sodium (mmol/L) · ground sampling visits",84,398,1110,23,"soft") + image("research-plot",80,445,1110,445,"bordered") + text("56 original observations<br>4 participants · 7 visits<br>Sodium / potassium · mmol/L",1260,441,570,32,"facts") + text("These measurements do not calibrate the monitoring rules.",1260,744,570,30,"soft"), {source:"OSD-575 · DOI 10.26030/mc5d-p710 · original values and provenance preserved"}),
  frame("Continue / Actual browser network disconnection", text("Disconnected.<br>Review continues.",80,213,830,78,"hero") + image("offline-status",84,455,780,62) + text("Reopened offline.<br>Record the action locally.<br>Nothing sent to medical support.",84,600,820,34,"facts") + `<div class="picture-panel" style="left:1040px;top:292px;width:800px;height:660px"></div>`),
  frame("OrbitCare / Notice. Explain. Review.", text("Keep the context.<br>Keep the review.",80,225,840,87,"hero") + text("orbitcare-eight.vercel.app",84,514,870,43,"website accent") + text("Review persisted after another offline reload.",84,659,830,29,"soft") + image("persisted-review",1030,300,780,585,"bordered") + text("Research prototype · not a medical or flight-certified system",84,885,1750,26,"soft"), {dark:true,source:"AI-assisted development · actual application captures · no NASA endorsement"}),
];
const html = content => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OrbitCare — final presentation</title><style>${css}</style></head><body>${content}</body></html>`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  if (!videoOnly) {
  await page.setContent(html(slides.join("")), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "public/demo/OrbitCare-seven-slides.pdf", printBackground: true, preferCSSPageSize: true });
  await writeFile("public/demo/slides.html", html(slides.join("")));
  for (let index = 0; index < slides.length; index++) await page.locator(".frame").nth(index).screenshot({ path: `${directory}/frames/slide-${index + 1}.png` });
  }
  await page.emulateMedia({ media: "screen" });
  for (let index = 0; !slidesOnly && index < videoFrames.length; index++) {
    await page.setContent(html(videoFrames[index]), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${directory}/frames/video-${index}.png` });
  }
} finally { await browser.close(); }

if (slidesOnly) {
  console.log("Updated the seven-slide PDF and slide HTML from existing captures; video and poster were left unchanged.");
  process.exit(0);
}

function run(args) {
  const result = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
}
const planned = [2.5,2.5,3,5,3.5,3,6,2.5];
const transition = .2;
for (let index = 0; index < videoFrames.length; index++) {
  const duration = planned[index] + (index < videoFrames.length - 1 ? transition : 0);
  const path = `${directory}/clips/scene-${index}.mp4`;
  if (index === 6) {
    const interaction = capture.action;
    const box = interaction.box;
    const target = {width:800,height:660,x:1040,y:292};
    const crop = `${Math.floor(box.width / 2) * 2}:${Math.floor(box.height / 2) * 2}:${Math.floor(box.x / 2) * 2}:${Math.floor(box.y / 2) * 2}`;
    run(["-loop","1","-framerate","30","-i",`${directory}/frames/video-${index}.png`,"-ss",String(interaction.start),"-t",String(interaction.duration),"-i",capture.action.sourceVideo,"-filter_complex_threads","1","-filter_complex",`[1:v]crop=${crop},fps=30,setpts=PTS-STARTPTS,scale=${target.width}:${target.height}:force_original_aspect_ratio=decrease,pad=${target.width}:${target.height}:(ow-iw)/2:(oh-ih)/2:white,tpad=stop_mode=clone:stop_duration=2[v];[0:v][v]overlay=${target.x}:${target.y}:shortest=1,format=yuv420p[out]`,"-map","[out]","-t",String(duration),"-c:v","libx264","-preset","fast","-crf","19","-pix_fmt","yuv420p","-an",path]);
  } else run(["-loop","1","-framerate","30","-i",`${directory}/frames/video-${index}.png`,"-t",String(duration),"-c:v","libx264","-preset","fast","-crf","19","-pix_fmt","yuv420p","-an",path]);
}
const inputs = videoFrames.flatMap((_, index) => ["-i",`${directory}/clips/scene-${index}.mp4`]);
let filter = ""; let elapsed = 0;
for (let index = 1; index < videoFrames.length; index++) {
  elapsed += planned[index - 1];
  filter += `${index > 1 ? ";" : ""}[${index === 1 ? "0:v" : `v${index - 1}`}][${index}:v]xfade=transition=fade:duration=${transition}:offset=${elapsed}[v${index}]`;
}
run([...inputs,"-filter_complex_threads","1","-filter_complex",filter,"-map","[v7]","-t","28","-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-movflags","+faststart","-an","public/demo/OrbitCare-demo.mp4"]);
await copyFile(`${directory}/frames/video-0.png`, "public/demo/poster.png");
const probe = spawnSync("ffprobe",["-v","error","-show_entries","format=duration,size:stream=width,height,r_frame_rate","-of","json","public/demo/OrbitCare-demo.mp4"],{encoding:"utf8"});
if (probe.status !== 0) throw new Error(probe.stderr);
const result = { ...JSON.parse(probe.stdout), slideCount: slides.length, aspectRatio: "16:9", actualAppCaptures: true, englishText: "large captions baked into each scene", imageGenerationModelUsed: false, aiAssistedCodeDefinedSchematic: true, offlineProof: capture.offline, actualReplayRecorded: false, actualReviewExplanationCapture: true, capturedAt: capture.capturedAt, reviewExplanation: capture.reviewExplanation };
if (Number(result.format.duration) > 30) throw new Error("Demo exceeds the limit.");
await writeFile(`${directory}/verification.json`,JSON.stringify(result,null,2));
console.log(result);
