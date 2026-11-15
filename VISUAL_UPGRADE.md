# OrbitCare visual upgrade — 15 November 2026

## Checkpoint and baseline

The starting working tree was clean. Its revision and status are recorded in `artifacts/upgrade-baseline/git-head.txt` and `git-status.txt`. `source-checkpoint.zip` is a Git archive of that complete revision; it does not change branches, commits, or existing files. No agent commit or push is authorized. The public production deployment remains the fallback until the redesigned artifact passes its checks.

Baseline rerun: 28 unit/data tests, lint, TypeScript, production build, and 12 Chromium acceptance tests passed. Screenshots cover 1440×900, 1920×1080, 1024×768, 390×844, and 360×800, including check-in dialogs and desktop/mobile supporting views.

## Evidence and priorities

| Priority | Screenshot evidence | Problem and proposed correction |
|---|---|---|
| P0 comprehension | `artifacts/upgrade-baseline/opening-1440.png` | The small amber sentence undersells the change; rule/persistence detail is separated and partly below the fold. Introduce a prominent change brief and linked original-unit differences. |
| P0 mobile | `opening-390.png`, `opening-360.png` | Almost the whole first screen contains navigation, page setup and scenario controls; no actual readings are visible. Compact navigation, reorder the finding, and use full-width plots below clear metric headers. |
| P1 reading | `monitor-1440.png`, `monitor-1920.png` | Many labels/body paragraphs are 9–12px despite ample desktop space. Establish readable 14–16px body styles and stronger numerical/type hierarchy. |
| P1 investigation | desktop monitor screenshots | Small day cells communicate color more readily than the sequence of reference/change/missing/review. Add day-state marks, phase text and review-event symbols with accessible labels. |
| P1 evidence | `research-1440.png`, `research-390.png` | Original research plot is descriptive but participant identity depends on color and point inspection is mostly hover-only. Add redundant shapes, keyboard-selectable points and a selected-observation readout. |
| P1 presentation | existing demo and slides | Full-screen repeated captures and A4 PDF make text too small. Rebuild focused 1080p scenes and exactly seven 16:9 slides. |

## Visual system and composition

Retain navy #122235, canvas #F5F7F6, ink #182B3A, teal #007F78 and amber #9A5B00. IBM Plex Sans remains the reading family, with Mono for mission timestamps. The signature is the visible chain from observed change to a transparent review reason, not decorative space imagery.

```text
compact navigation | crewmember / mission day / check-in
                   | change brief: what changed / compare / investigate
                   | four clearly described synthetic scenarios
                   | aligned health record | personal comparison + rule
                   | mission progression  | review action / history
```

On mobile: compact brand/navigation → mission context → change brief → scenario choices → readable full-width plots → explanation/timeline in coherent order. Investigate controls move focus to the explanation; charts retain an accessible table and keyboard day selection.

No new risk score, prediction, medical threshold, telemetry, health conclusion, or real-data calibration is authorized. `lib/analysis.ts`, model/validation/persistence, scenario fixtures, NASA source bytes, and service-worker logic are protected from incidental design edits. Changes here are presentation and interaction improvements, with actual scientific statements retained.

One presentation correction is intentional: during replay, future timeline days no longer reveal their later review/missingness status. Their dates remain selectable, but markers appear only when that day is reached. The numerical engine and saved records are unchanged; browser assertions cover the future→review transition. The earlier implementation already hid future plots/tables but exposed later flags in the timeline index.

## Skill use

Frontend Design: intentional composition, typography, critique through rendered screenshots. Vercel guidelines: focus, forms, keyboard, contrast, responsive states. React Best Practices: preserve local computation and defer the separate research view. UI UX Pro Max: project-scoped guidance for readable data interfaces and touch/keyboard interaction. Impeccable: inspected critique/polish references; use focused hierarchy/system refinement principles without installing its hooks, engine, detector, or live mode.

UI UX Pro Max is installed in `.agents/skills/ui-ux-pro-max/` from commit `d643997c82e94742dd3bee43210b0198e8bbba3d` with its MIT notice. Its Python search uses the standard library; no global dependency or new application runtime package was added.

## Final result and visual evidence

Compare the same viewport captures:

| View | Baseline | Redesigned |
|---|---|---|
| 1440×900 opening | [Before](artifacts/upgrade-baseline/opening-1440.png) | [After](artifacts/upgrade-final/opening-1440.png) |
| 1920×1080 opening | [Before](artifacts/upgrade-baseline/opening-1920.png) | [After](artifacts/upgrade-final/opening-1920.png) |
| 1024×768 tablet | [Before](artifacts/upgrade-baseline/opening-1024.png) | [After](artifacts/upgrade-final/opening-1024.png) |
| 390×844 mobile | [Before](artifacts/upgrade-baseline/opening-390.png) | [After](artifacts/upgrade-final/opening-390.png) |
| 360×800 mobile | [Before](artifacts/upgrade-baseline/opening-360.png) | [After](artifacts/upgrade-final/opening-360.png) |

Each directory also contains full workspace captures, check-in dialogs and desktop/mobile research, method and data views. Final screenshots were visually inspected; `layout-measurements.json` records exact dimensions. Artifacts are ignored local evidence, not required public app assets.

The change brief now exposes original-unit differences before the scenario choices. Reference/reading pairs and a three-step persistence display make the explanation the signature interaction. Larger plots retain gaps, selected-day marks and accessible tables. The timeline adds state symbols and recorded-review markers; research points add participant shapes and keyboard selection. Mobile has a coherent reading order and an unobstructed check-in action. Scientific caveats and local-only review language remain visible.

No changes from the checkpoint were found in protected scientific/data/storage/offline files. Future-status masking in the timeline is the single intentional presentation behavior correction, covered by browser regressions.

Final local verification: 28 unit/data tests, 15 Chromium tests, lint, TypeScript, production build and Microsoft Edge offline/persistence smoke passed. See QA_REPORT.md and DEPLOYMENT.md for release verification and public results.

## Rebuilt presentation

`public/demo/OrbitCare-demo.mp4`: 28.000 seconds, 1920×1080, 30 fps, large English captions, actual app closeups and an actual disconnected-browser form interaction. `public/demo/OrbitCare-seven-slides.pdf`: exactly seven native 16:9 pages. Every exported PDF page and encoded video scenes were visually inspected. Reproduction: run the production preview, then `npm run media:build`; details and provenance are in DEMO_SCRIPT.md and `artifacts/presentation/`.
