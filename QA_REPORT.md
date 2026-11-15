# OrbitCare ? redesigned release verification

Performed 15 November 2026 in the participant's Windows workspace. Environment: Node.js 26.8.1, Next.js 16.4.6, React 19.3.0. These are software checks, not clinical validation or an astronaut usability study.

## Checks actually run for this upgrade

| Check | Observed result |
|---|---|
| Baseline checkpoint | Clean starting revision bb634c3103e65158cb09e8a570099dd141f2a728; full source archive and Git state retained in artifacts/upgrade-baseline/ |
| Baseline verification | 28 unit/data tests, lint, TypeScript, production build and 12 browser checks passed before application edits |
| Final npm test | 28 tests passed across three numerical, validation and research-integrity suites |
| Final npm run lint | Passed |
| Final npm run typecheck | Passed |
| Final npm run build | Passed; 56 original research observations reproduced; static export and offline manifest generated |
| Final local Chromium suite | All 15 tests passed, including new change-brief, future-timeline, keyboard research and five-viewport assertions |
| Microsoft Edge smoke | Passed against both local artifact and final public URL: actual offline reload, persisted local review, bundled research, no page errors |
| Automated accessibility | Tested monitor, research, method, data and check-in dialog: no axe WCAG 2 A/AA and 2.1 AA violations detected |
| Visual audit | Baseline and final screenshots at 1440?900, 1920?1080, 1024?768, 390?844 and 360?800; no horizontal document overflow in the tested layouts |
| Preservation check | No diff from the starting checkpoint in analysis, types, validation, persistence, offline hook, scenario fixtures, NASA raw/derived measurements or service-worker generator |
| NASA integrity | Exact source checksum and byte length, all 56 selected values, original units, four participants and seven visits verified by existing data tests |
| Video verification | FFprobe: 28.000 seconds, 1920?1080, 30 fps, H.264/yuv420p, 1,172,296 bytes; encoded frames inspected across the actual rendered scenes |
| PDF verification | Exactly seven pages, each 1440?810 points (16:9); every actual exported page rendered with PyMuPDF and visually inspected |
| Preview verification | Preview app content matches the tested HTML before Vercel's added feedback script; MP4 and PDF match local SHA-256 checksums |
| git diff --check | Passed; ordinary Windows LF/CRLF conversion notices only |

All **15 public Chromium checks passed** against https://orbitcare-eight.vercel.app after the redesigned deployment, in fresh unauthenticated contexts (46.6 seconds). Local acceptance passed all 15 as well (41.6 seconds). DEPLOYMENT.md records release IDs and checksums. A preview with Vercel authentication is not the public judge link.

## Browser coverage

The 15-test suite exercises deterministic scenarios and replay; reference/explanation values; absence of future observations and future timeline flags; check-in validation, valid zeros, deliberate edits and reload persistence; local review history without clearing computed flags; research/source separation; actual JSON export/import and invalid-import rejection; reset and custom workspaces; genuine network disconnection and production reopening; offline save/reload/export and bundled evidence; honest failure for a first unprepared offline visit; responsive controls, contrast and keyboard dialogs; later mission days and print records; media playback/duration/aspect, seven-page PDF/aspect and original CSV availability; focus transfer from the change brief; review-event markers; keyboard selection of original NASA points; and reduced-motion behavior at all five viewports.

Numerical tests cover hand-calculated median/MAD, lower ordinal median, reference sufficiency, exact rule boundaries, missing/non-comparable sequences and future-data exclusion. Validation tests cover malformed, oversized, unsupported-version and invalid-origin imports, duplicate days/IDs, shifted references and valid zeros/nulls. No algorithm was changed to improve screenshots.

## Issues found and corrected during the upgrade

- A floating mobile check-in control covered scenario content. It now sits inside the page header.
- Enlarged research labels exposed a clipped axis value; label position was corrected without changing data.
- Low-contrast explanatory labels were corrected and accessibility checks rerun.
- Timeline replay previously exposed later-day flags even though plots/tables hid future readings. Later status markers now appear only when their day is reached. Dates remain selectable; numerical analysis and saved records are unchanged.
- First media renders had overlapping opening text, padded captures, hover tooltips and small rule details. Rendered scenes were inspected and corrected; final media uses enlarged source details and explicit units.
- Windows Controlled folder access remains enabled. Existing tests use a dedicated OS-temp download directory, so no Defender allow-list exception was necessary.

## Media provenance

The video combines composed actual application closeups with a recorded form interaction after genuine browser network disconnection. It is not presented as a continuous unedited recording. The application was reloaded offline before recording the review, and the record survived a second offline reload. Assertions and raw-capture timing are retained in artifacts/presentation/capture.json. FFprobe output, preview checksums and actual PDF page renders are in the same directory. No image/video-generation model, NASA logo, under-18 likeness or invented application function is used.

## Scientific and practical limits

Monitoring rules remain unvalidated engineering assumptions. NASA laboratory observations are a separate descriptive research view and do not validate thresholds. No diagnosis, treatment, clinical accuracy, disease prediction, emergency prevention or flight-certification claim is supported. Offline review records locally and does not contact medical support.

No clinical/astronaut usability evaluation, Firefox/Safari/physical-mobile-device testing, full screen-reader audit, penetration test or Lighthouse/Core Web Vitals benchmark was run. Automated axe success is not accessibility certification. Deliberate quota exhaustion and browser-eviction recovery remain untested; multi-tab/multi-device synchronization is unsupported. The earlier release's dependency/security audits are historical results, not newly rerun security certification.

The current official submission-guide PDF, current award eligibility/definitions and any earlier local judging cutoff remain independently unverified by the agent. The participant must reconcile their guide/dashboard, review final media/text, publish source manually if desired, and click **Submit for Judging**, retaining successful confirmation. The agent made no commits, pushes or NASA judging submission.
