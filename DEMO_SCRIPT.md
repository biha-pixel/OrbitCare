# OrbitCare - guided-care demonstration

Final format: 28.000 seconds, 1920x1080, 16:9, 30 fps, H.264/yuv420p, silent with English captions. Composed actual application closeups and a recorded offline interaction; not a continuous recording.

| Time | Actual application material | Purpose |
|---|---|---|
| 0-2.5 s | Stable synthetic monitoring record | Introduce personal health context |
| 2.5-5.5 s | Four guide choices, method and equipment excerpts | Explain how recording is guided |
| 5.5-8.5 s | Sustained-change indicator controls | Show personal differences, without diagnosis |
| 8.5-12 s | Personal reference, selected reading, delta and coverage | Make the comparison inspectable |
| 12-16 s | Schematic body map and actual NASA context card | Link recorded indicators to research and boundaries |
| 16-19.5 s | Actual urgent-panel direction, trend warning and no-contact text | Separate acute concerns from gradual trends |
| 19.5-25.5 s | Actual disconnected browser status and recorded review interaction | Show genuine offline operation and a local action |
| 25.5-28 s | Review history after second offline reload, public URL | Establish persistence and limitations |

Crossfades are 0.2 seconds. Numbers are actual existing synthetic measurements, not invented animation frames. The original code-defined SVG is an educational selector, not NASA imagery or an organ-health assessment. No treatment steps, generated astronaut media, NASA insignia or medical outcomes appear. AI_USE.md discloses AI-assisted graphics/code and participant ownership.

## Outputs and reproduction

- Video: public/demo/OrbitCare-demo.mp4.
- Exactly seven native 16:9 PDF pages: public/demo/OrbitCare-seven-slides.pdf.
- Standalone slide source: public/demo/slides.html.
- Raw interaction timing, actual network-disconnection and persistence assertions: artifacts/presentation/capture.json.
- FFprobe results: artifacts/presentation/verification.json.
- Actual exported PDF page renders: artifacts/presentation/pdf-rendered/.
- Decoded encoded-video scenes: artifacts/presentation/encoded-0.png through encoded-7.png.

Run npm run build then npm start. In another terminal, npm run media:build uses installed Playwright and FFmpeg to capture/render both artifacts. Optional PDF verification: py -3.13 scripts/verify-presentation.py with the project-local verification wheel; no new runtime dependency is added.

Slides: problem/challenge; solution; guided recording and personal monitoring; explainable review and acute concerns; verified offline operation; NASA evidence and body explorer; mission impact/limits/link. OSD-575 remains a separate real-data view in the app, with unchanged provenance and values.

Participant must watch the public final video, review all seven slides and reconcile the current guide before final submission. External NASA links require internet; core evidence and guides are bundled offline.
