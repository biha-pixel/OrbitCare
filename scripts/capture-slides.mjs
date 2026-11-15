import { chromium, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const base = process.env.ORBITCARE_DEMO_URL || "http://127.0.0.1:3000";
await mkdir("artifacts/slides", { recursive: true });
await mkdir("public/demo", { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
  const page = await context.newPage();
  await page.goto(base);
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
  await page.screenshot({ path: "artifacts/slides/monitor.png" });
  await page.locator(".explanation").screenshot({ path: "artifacts/slides/explanation.png" });
  await page.getByRole("button", { name: "Missing data", exact: true }).click();
  await page.screenshot({ path: "artifacts/slides/missing.png" });
  await page.getByRole("button", { name: "Sustained change", exact: true }).click();
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Browser offline", { exact: true })).toBeVisible();
  await page.getByLabel("Review note", { exact: false }).fill("Offline measurement verification recorded.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "artifacts/slides/offline.png" });
  await page.getByRole("button", { name: "NASA research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A record across sampling visits" })).toBeVisible();
  await page.screenshot({ path: "artifacts/slides/research.png" });
  const img = async name => `data:image/png;base64,${(await readFile(`artifacts/slides/${name}.png`)).toString("base64")}`;
  const slides = [
    { title: "OrbitCare", text: "Understand sustained personal change. Inspect the reasoning. Record a review—even offline.", sub: "Bihandu Liyanage · NASA Space Apps 2026 · Anuradhapura virtual participant", image: "monitor" },
    { title: "A personal record, not an isolated reading", text: "Heart rate, sleep and fatigue align with a fixed reference. Exercise adds context. Four resettable synthetic scenarios make the demonstration reproducible.", image: "monitor" },
    { title: "Every flag has an explanation", text: "Reference, current value, original-unit difference, persistence, source context and uncertainty. Three-day rules are transparent engineering assumptions, not NASA clinical thresholds.", image: "explanation" },
    { title: "Missing does not mean reassuring", text: "Missing and non-comparable readings stay visible. They interrupt persistence rather than becoming zero or silently extending a sequence.", image: "missing" },
    { title: "Disconnect. Reload. Record a review.", text: "Actual network disconnection and offline reload. A review was saved locally; nothing was sent to Earth. Offline readiness is verified separately from persistence.", image: "offline" },
    { title: "Real NASA observations, kept separate", text: "OSD-575: 56 original sodium/potassium observations, four Inspiration4 participants, seven ground visits. Original units, source checksum and methodology preserved. No threshold calibration or invented in-flight telemetry.", image: "research" },
    { title: "Try OrbitCare", text: "https://orbitcare-eight.vercel.app", sub: "Research prototype—not a diagnosis, treatment, emergency-triage or flight-certified system. Clinical accuracy is unvalidated. Participant-led concept; AI-assisted implementation disclosed. No NASA endorsement.", image: "monitor" },
  ];
  let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OrbitCare — seven-slide fallback</title><style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0;font:16px/1.5 Arial,sans-serif;color:#182B3A;background:#F5F7F6}.slide{height:210mm;padding:14mm 16mm;break-after:page;position:relative;overflow:hidden}.slide:last-child{break-after:auto}.brand{font-size:13px;color:#007F78;margin-bottom:8px}h1{font-size:32px;letter-spacing:-1px;line-height:1.15;margin:0 0 10px}p{max-width:105ch;font-size:16px;margin:0 0 12px}.sub{font-size:13px;color:#53695C}img{display:block;max-height:125mm;max-width:100%;object-fit:contain;object-position:left top;border:1px solid #DCE4DF;background:white}.num{position:absolute;right:16mm;bottom:6mm;font-size:11px;color:#53695C}</style></head><body>`;
  for (const [index, slide] of slides.entries()) html += `<section class="slide"><div class="brand">OrbitCare · Research prototype</div><h1>${slide.title}</h1><p>${slide.text}</p>${slide.sub ? `<p class="sub">${slide.sub}</p>` : ""}<img alt="Actual OrbitCare ${slide.image} interface" src="${await img(slide.image)}"><span class="num">${index + 1} / 7</span></section>`;
  html += "</body></html>";
  await writeFile("public/demo/slides.html", html);
  const printContext = await browser.newContext();
  const printPage = await printContext.newPage();
  await printPage.setContent(html, { waitUntil: "load" });
  await printPage.pdf({ path: "public/demo/OrbitCare-seven-slides.pdf", printBackground: true, preferCSSPageSize: true });
  console.log("Generated seven-slide actual-screenshot fallback and PDF, including verified offline capture.");
} finally { await browser.close(); }
