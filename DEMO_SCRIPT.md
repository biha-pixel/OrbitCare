# OrbitCare - cinematic mission demonstration

Final format: 28.000 seconds, 1920 x 1080, 16:9, 30 fps, H.264/yuv420p. Silent with large English captions. Edited actual application captures and a recorded offline interaction; not a continuous recording.

| Time | Actual application material | Purpose |
| --- | --- | --- |
| 0-2.5 s | Labeled procedural 3D mission scene; Far from Earth. Care stays personal. | Introduce the mission and personal health context |
| 2.5-5 s | Day-14 reference card and reference-to-day-24 comparison | Establish the fixed personal reference in original units |
| 5-8 s | Actual day-22 replay card | Distinguish the first changed reading from sustained change |
| 8-13 s | Actual day-24 explanation: 60 to 71 bpm, +11 bpm, three consecutive days and rule | Make review reasoning inspectable without a diagnosis |
| 13-16.5 s | Crew Assist guidance from the fictional drill | Put approved procedures and trained personnel first; no automated contact |
| 16.5-19.5 s | Original OSD-575 sodium chart, mmol/L and ground visits | Separate real laboratory research from synthetic monitoring rules |
| 19.5-25.5 s | Browser offline status and recorded local review interaction | Demonstrate real offline reload, saving and no transmission |
| 25.5-28 s | Review history after a second offline reload and public URL | Demonstrate persistence and retain prototype limitations |

Crossfades last 0.2 seconds. Physiological values are actual fixture readings, not interpolated animation values. The globe and flight path are conceptual procedural artwork, not a geographic map or mission telemetry; their AI assistance is visibly disclosed. No image/video generation model, NASA insignia, treatment steps or medical outcome was introduced.

The seven native 16:9 PDF slides cover mission/problem, personal change brief, decision replay/explanation, Crew Assist/local handoff, original NASA observations, genuine offline continuity, and demonstrated abilities/remaining validation. Both Bihandu Liyanage and Nesandu Liyanage are credited, with Anuradhapura, Sri Lanka.

Outputs are public/demo/OrbitCare-demo.mp4, poster.png, OrbitCare-seven-slides.pdf, slides.html and the accessible player/transcript index.html. Evidence is in artifacts/presentation/capture.json, verification.json, encoded-frames/, pdf-rendered/, video-contact.png and pdf-contact.png.

With the production server running at port 3000, npm run media:build captures and renders both artifacts using installed Playwright and FFmpeg. scripts/capture-mission-scene.mjs can refresh only the scene; scripts/render-presentation.mjs then recomposes the media. Run the production build again before deployment to include updated public media. node scripts/verify-video-frames.mjs decodes the actual MP4; py -3.13 scripts/verify-presentation.py rasterizes the actual PDF using the existing local package. That package requires filesystem approval in this restricted executor. No new runtime dependency is added.

Review the final public video, PDF, AI-use disclosure and official submission fields before submitting for judging. Publishing the application does not submit the challenge entry.
