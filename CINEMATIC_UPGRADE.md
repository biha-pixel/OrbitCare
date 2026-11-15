# OrbitCare cinematic experience — 15 November 2026

## Audit and checkpoint

The starting Git worktree was clean. `artifacts/cinematic-baseline/revision.txt` records the starting revision; `git-status.txt` records status; `source-checkpoint.zip` is a complete tracked-source checkpoint, including the original media. No reset, force-push, source commit or source push was performed.

The repository has one static Next.js application route with client-selected monitoring, explorer, research, method, data and Crew Assist views, plus static submission media. The audit covered those views, analysis/replay, validation and IndexedDB, emergency and handoff boundaries, service-worker generation, media capture, and existing unit and browser regressions. Before captures are in `artifacts/upgrade-cinematic-before/` at all five requested viewports.

The central problem was hierarchy: several scenario choices and a health finding preceded the explanation of the mission. Full replay presented 28 equally prominent daily controls. Research provenance was available but its mission context took longer to discover. The existing clinical limitations, local records, charts and crew pathways were already valuable and were retained.

## Direction and implementation

The plan was to introduce the mission, demonstrate the actual workflow, simplify replay navigation, connect the body and research views, inspect the result, and release the tested static artifact. The visual system retains IBM Plex Sans/Mono, teal `#007f78`, readable canvas `#f5f7f6` and navy `#0d2131`, adding deep-space `#081725`, atmospheric mist `#a9c5ce` and restrained mineral accents. A proposed cooler canvas failed minimum text contrast in browser checks and was reverted. The subject-specific signature is the conceptual flight scene; working charts and forms remain calm and readable.

### First impression and guided mission

- Optional mission introduction: “Care for the human behind the mission.” The main action enters the functioning demo; direct monitoring and Crew Assist remain available immediately.
- Observe → Compare → Explain → Record is a visible sequence of real actions.
- Mission overview in navigation reopens the introduction. Health review enters monitoring directly. The urgent control remains outside the tour and scene.
- Five keyboard-accessible stages: fixed reference on day 14; actual recorded days 22/23/24; day-24 explanation; the existing local review form; actual offline readiness and connection status.
- The tutorial calls the same `analyze`, `MetricPlot` and `Explanation` components. The actual day-22 heart rate is **69 bpm**; day 24 is **71 bpm**, against a **60 bpm** reference. No intermediate readings are generated.
- Reviews use the existing schema and save queue in a separate `guided-mission` workspace. Starting the tour does not reset or switch the active monitoring workspace. Saved demo reviews remain exportable through the ordinary data tools. Guided-fixture check-ins are read-only, so demonstrations retain the verified readings. Reset preserves the dedicated workspace ID and cannot replace another scenario. Exit/reentry retains tour position in the current page session; reload starts the introduction again and retains saved records.
- Exact recorded values and comparability are available under the tutorial chart. Offline guidance never toggles or fabricates connectivity.

### Graphics and motion

`components/mission-space.tsx` renders original procedural spheres with native WebGL/GLSL: directional light, atmospheric rim, noise-based surface/cloud patterns and a fixed starfield. SVG adds a conceptual path and spacecraft. This is an illustrative Earth-like globe and Mars, not a geographic map, ephemeris, distance model, NASA photograph or live mission display.

No new runtime dependency, model, texture, remote font or animation framework was installed. Next.js dynamic imports separate the scene and tutorial. The existing local Plex fonts, Recharts and Lucide remain. The new scene is about a few kilobytes of source rather than a model/texture package.

Rendering is capped near 20 fps and 1.5 device-pixel ratio. Pause preserves elapsed scene time. Reduced motion renders a still; offscreen/hidden scenes stop scheduling frames. Resize/visibility observers, listeners, GPU program/buffer/shaders and animation frames are cleaned up on exit. Failed WebGL/shaders or context loss reveal the CSS illustration. Nothing about graphics capability blocks a monitoring or urgent action. These safeguards and browser runs are not physical-device GPU, battery or long-duration memory benchmarks.

CSS coordinates a short entrance, state reveals and selected-region movement. Numeric health values are never tweened. The original logo source and animation CSS are unchanged, including urgent-mode and reduced-motion behavior.

### Replay, body, research and crew

- Replay leads with Reference → First change → Persistence → Review. Known dates come only from measurements at or before the selected day. Unknown milestones are disabled and undated. The full daily record is an explicit disclosure; slider, previous/next, turning-point navigation and controlled playback remain.
- `knownTurningPoints` reuses original reference/comparability/rule functions and scans known rows. Tests compare it with the original analysis at every day across all four scenarios and three indicators; calendar gaps break persistence.
- The body explorer uses a layered 2.5D SVG with lighting, selected-system depth, scan lines, connectors and a synchronized topic strip. Regions remain educational navigation. Original indicators, exact selected-day records, measurement guides, research links and interpretation limits remain.
- Research opens with Inspiration4, what was measured, ground collection, participants/visits, units and the calibration boundary. Participant selection highlights its original observations. Original OSD-575 bytes, values, participants, visits, provenance, DOI and full tables are unchanged.
- Crew Assist is visible in the opening and persistent assistance controls. Its guidance, fictional drill, unknowns, unsaved-draft protection, incident JSON, local handoff and medical-contact boundaries remain. Cinematic content never appears in the urgent path.

## Evidence and verification

Before and after opening captures:

| Viewport | Before | After |
| --- | --- | --- |
| 1920 × 1080 | [Before](artifacts/upgrade-cinematic-before/opening-1920.png) | [After](artifacts/cinematic-after/opening-1920.png) |
| 1440 × 900 | [Before](artifacts/upgrade-cinematic-before/opening-1440.png) | [After](artifacts/cinematic-after/opening-1440.png) |
| 1024 × 768 | [Before](artifacts/upgrade-cinematic-before/opening-1024.png) | [After](artifacts/cinematic-after/opening-1024.png) |
| 390 × 844 | [Before](artifacts/upgrade-cinematic-before/opening-390.png) | [After](artifacts/cinematic-after/opening-390.png) |
| 360 × 800 | [Before](artifacts/upgrade-cinematic-before/opening-360.png) | [After](artifacts/cinematic-after/opening-360.png) |

`artifacts/cinematic-after/` also contains tutorial stages, replay, body, research, crew and denied-WebGL captures. All five viewport audits reported no horizontal overflow, no page errors, and a working WebGL scene. Screenshots were visually inspected; desktop and mobile disclosures, label placement, scientific boundaries and chart readability informed corrections.

The final local verification is recorded in `artifacts/cinematic-release/local-verification.json`: **41/41 unit/data tests, 42/42 production browser tests, lint, explicit TypeScript and the production build all passed**. The final full browser run took 2.6 minutes. Edge passed real offline reopening, a saved review, a second offline reload and bundled research. Completed checks include the original analysis/source tests, new milestone equivalence checks, production compilation, TypeScript, lint, real Chromium offline persistence and Edge offline smoke. Browser regressions cover check-ins, reference comparison, gaps, import/export, printing, crew incidents and handoff, research, emergency access, accessibility, reduced motion and genuine offline reloads. New coverage includes guided review/export, isolated saved records, keyboard stage navigation, graphics failure/context loss and touch navigation.

Core cache currently contains **51 assets, approximately 1.65 MiB**. Submission media remains excluded from core offline preparation. External citations require a connection. Actual disconnected-browser captures saved a review and verified it after a second offline reload. A fresh, unprepared offline browser is still expected not to load.

## Submission media and provenance

The refreshed video is **28.000 seconds**, **1920 × 1080**, **30 fps**, H.264/yuv420p, with English captions and no audio. It combines real app captures, the actual day-24 explanation, real Crew Assist guidance, original NASA observations and a recorded interaction after actual browser disconnection. It is an edited demonstration, not a continuous recording. The PDF is exactly **seven 16:9 slides** and retains **Bihandu Liyanage and Nesandu Liyanage**, Anuradhapura, Sri Lanka.

The first scene and first slide show the actual procedural planet. Its in-app label and media captions disclose AI-generated procedural artwork. No image/video generation model, NASA logo, mission insignia, astronaut photograph or third-party visual asset was added. Code-defined original artwork follows the repository MIT license. Existing NASA data and software/font/icon terms remain in [REFERENCES.md](REFERENCES.md). Expanded assistance disclosure is in [AI_USE.md](AI_USE.md).

The official [challenge](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/) remains the project scope. The NASA Space Apps [AI clarification](https://github.com/nasa/spaceapps/discussions/1947) was consulted for visible imagery disclosure; this release labels the procedural art even though it is rendered by application code.

## Deployment status

Production **dpl_TMyUrpL1vHy9Lbxjp4cChWmUe5WF** is **Ready** at [orbitcare-eight.vercel.app](https://orbitcare-eight.vercel.app/), with deployment URL https://orbitcare-glymu5tpc-nutri-38e1.vercel.app. It was created by promoting the exact approved candidate **dpl_AWZz2FrihrbgtFMTRVqbMiEigqhB**. The [protected preview](https://orbitcare-h884wvtaa-nutri-38e1.vercel.app) remains available with protection retained. Both preview and public application markers, SW, MP4 and PDF match the tested artifact; public poster, slide HTML, player HTML and original NASA CSV also match byte for byte (`artifacts/cinematic-release/public-verification.json`). Public screenshots and playback evidence are in `public-browser-captures.json`, `public-opening-1440.png`, `public-opening-390.png` and `public-player.png` in that directory.

The participant explicitly approved promotion of this exact candidate, resolving the earlier approval boundary. Promotion completed on **15 November 2026 at 20:01 Asia/Colombo**. The previous production **dpl_ivAkd6evSFgFx1ghkmtsHqPpeNfr** remains in deployment history for rollback. Unauthenticated public video playback, both team credits, desktop/mobile screenshots and Edge offline review persistence have passed. All 42 public acceptance checks are verified: 41 passed the initial full run; the remaining accessibility check passed on rerun after the audit was made to wait for finite entrance animations. This changed test timing only; production files are unchanged.

Final core version: `efccd56fac9c6a3d`; SW SHA-256 `80a51a47dba1ec457cbbafdde3aa29585a724f26c6501df88df9fe09c3cd6017`. Video: **1,331,217 bytes**, SHA-256 `8f18b1951d0e81b210ddab8540d4fc77212abd78f7cbb16f1407dc92146d6ef8`. PDF: **1,467,224 bytes**, SHA-256 `10eec27cb8c47d2c31181998cece4020d09e6b281b51101c3f99d4e3a7a64dd6`. The whole video decodes without error. Actual exported PDF pages and decoded video scenes were visually reviewed; [PDF board](artifacts/presentation/pdf-contact.png), [video board](artifacts/presentation/video-contact.png).

Eighteen protected engine/schema/storage/data/offline/logo/dependency/license files match the checkpoint. New replay presentation helpers are covered by engine-equivalence tests. No qualifying Next.js framework feedback candidate remained after the required final feedback pass.

## Limits and manual actions

No clinical validity, diagnosis, treatment, organ-health score, spacecraft communication test or operational readiness is claimed. The globe is conceptual. Automated viewport/touch tests are not testing on physical phones, and Safari/iOS was not available here. Offline operation requires prior preparation. Local storage is unencrypted and browser-managed; use one editing tab and export records to retain them. There is no automatic medical contact or device synchronization.

Publication is separate from NASA judging submission. The registered participant must review the final project fields and links, submit through the official account, and retain confirmation. Source edits remain available locally for review and source publication; no Git commit or push was made.
