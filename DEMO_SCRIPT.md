# OrbitCare — final 1080p demonstration

The redesigned submission video is **28.000 seconds**, **1920×1080**, 16:9, 30 fps, H.264/yuv420p, silent with large English captions. It combines focused captures of the actual application with a recorded interaction in a genuinely disconnected browser. It is not presented as one continuous recording.

| Time | Actual material | Message |
|---|---|---|
| 0–3 s | Stable synthetic monitoring record | Personal health changes need individual context. |
| 3–5 s | Original stable-scenario metric controls | Start with the astronaut's fixed personal reference. |
| 5–8 s | Original sustained-change controls, day 24 | The selected observations now differ enough to meet the illustrative rules. |
| 8–11.5 s | Personal comparison and original-unit difference closeups | Inspect the reference, selected reading, and observed difference. |
| 11.5–15 s | Actual persistence and rule panels | Three changed days; transparent engineering assumptions, no diagnostic claim. |
| 15–19 s | Original OSD-575 scatterplot, units and participant legend | NASA research is a separate descriptive view, not monitoring-threshold validation. |
| 19–25 s | Actual offline browser badges and recorded review-form interaction | Reloaded offline; record an action locally without contacting medical support. |
| 25–28 s | Review history captured after a second offline reload; public URL | The local record persists. Research prototype, not a certified medical system. |

Crossfades are 0.2 seconds. Captures use clearly labeled synthetic monitoring, original NASA research, and the actual UI. No generated astronaut footage, NASA insignia, invented telemetry, fake disconnection toggle, narration, or under-18 likeness is included.

## Files and reproduction

- Video: `public/demo/OrbitCare-demo.mp4`.
- Presentation: `public/demo/OrbitCare-seven-slides.pdf`, exactly seven native 16:9 pages.
- Standalone slide HTML: `public/demo/slides.html`.
- Capture provenance, network/persistence assertions and raw interaction timing: `artifacts/presentation/capture.json`.
- FFprobe output: `artifacts/presentation/verification.json`.
- Actual rendered PDF pages: `artifacts/presentation/pdf-rendered/`.

Start the production preview with `npm run build` then `npm start`. In another terminal, `npm run media:build` captures and renders both artifacts using the installed Playwright and FFmpeg. No NASA requests or paid services are needed. Optional actual-PDF rendering uses `py -3.13 scripts/verify-presentation.py` with the local verification wheel described in the upgrade report; it is not an application dependency.

The seven slides are: (1) problem/challenge, (2) complete solution, (3) personalized reference, (4) explainable review, (5) offline operation, (6) NASA research/transparency, (7) impact/limitations/link. Their source is a purpose-built 16:9 layout, not rescaled A4 pages.

The participant should watch the final public video and review the final PDF and submission fields. AI_USE.md records AI assistance and the use of actual screen captures. The official guide must still be checked for final submission requirements.
