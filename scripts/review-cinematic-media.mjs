import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const root = "artifacts/presentation";
const browser = await chromium.launch();
try {
  for (const [name, sources] of [
    ["pdf-contact", Array.from({ length: 7 }, (_, index) => [`Slide ${index + 1}`, `${root}/pdf-rendered/slide-${index + 1}.png`])],
    ["video-contact", [1,3.8,6.5,10.2,14.8,17.5,21,26.5].map(time => [`Encoded video ${time}s`, `${root}/encoded-frames/at-${time}.png`])],
  ]) {
    const cards = [];
    for (const [label, path] of sources) cards.push(`<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${(await readFile(path)).toString("base64")}" width="420" height="236"></figure>`);
    const page = await browser.newPage({ viewport: { width: 1324, height: 900 }, deviceScaleFactor: 1 });
    await page.setContent(`<html><head><style>*{box-sizing:border-box}body{margin:0;padding:16px;background:#dbe5e5;font:14px system-ui;color:#173540;display:grid;grid-template-columns:repeat(3,420px);gap:16px}figure{margin:0}figcaption{padding:8px 0}img{display:block;object-fit:contain;background:#fff}</style></head><body>${cards.join("")}</body></html>`);
    await page.screenshot({ path: `${root}/${name}.png`, fullPage: true });
    await page.close();
  }
  await writeFile(`${root}/review-boards.json`, JSON.stringify({ actualExportedPdfPages: 7, encodedVideoTimes: [1,3.8,6.5,10.2,14.8,17.5,21,26.5] }, null, 2));
  console.log("Prepared review boards from actual PDF rasterization and decoded MP4 frames.");
} finally { await browser.close(); }
