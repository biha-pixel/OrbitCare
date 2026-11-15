# OrbitCare - guided-care release verification

Performed 15 November 2026 in Asia/Colombo. Node.js 26.8.1, Next.js 16.4.6, React 19.3.0. Software checks are not clinical validation or an astronaut usability study.

## Preservation and baseline

The starting clean revision was 25f1464. Git state and a full source archive were saved in artifacts/alignment-baseline/. Before application changes, 28 unit/data tests, lint, TypeScript, production build and 15 browser regressions passed. Five-size screenshots are in artifacts/upgrade-alignment-baseline/. No agent commit or push was made.

The numerical analysis, types, validation, scenario fixtures, NASA raw/derived measurements, IndexedDB persistence, offline hook and service-worker generator have no diff from that checkpoint. Data schema v1 and existing export/import behavior remain intact. New source-backed guidance and UI read existing analysis results. Urgent concern contains no diagnostic algorithm or record/communication system.

## Completed checks

| Check | Actual observed result |
|---|---|
| npm test | 28 numerical, validation and source-integrity tests passed |
| npm run lint | Passed |
| npm run typecheck | Passed |
| npm run build | Passed; 56 verified original NASA observations reproduced; static artifact and service worker generated |
| New guided-care checks | Guides, acute concern in stable/empty records, check-in-to-urgent navigation, system mapping, as-of replay, responsiveness, reduced motion and offline persistence passed in the final 23-test run |
| Existing regression coverage | All original 15 checks passed within that complete local run |
| Accessibility | No axe WCAG 2 A/AA and 2.1 AA violations in the tested original views/dialog, new urgent dialog, body explorer and expanded guide |
| Microsoft Edge | Final local artifact passed actual offline reload, persisted review, bundled research and no page-error smoke |
| Visual review | Real captures at 1440x900, 1920x1080, 1024x768, 390x844 and 360x800, including all three systems, guidance and urgent concern; no document overflow |
| Video | FFprobe: 28.000 seconds, 1920x1080, 30 fps, H.264/yuv420p, 1,236,621 bytes; encoded scenes inspected |
| Presentation | Exactly seven 16:9 PDF pages (1440x810 points); every actual exported page rendered with PyMuPDF and visually inspected |
| Source/data preservation | Protected-file diff empty; original checksum and all 56 selected NASA values pass existing tests |
| git diff --check | Passed, ordinary Windows line-ending notices only |

All 23 final local browser tests passed (2.2 minutes). The eighth new test explicitly verifies missing-data action guidance, local no-request language, recent-observation focus and urgent replay pause. Final public acceptance is recorded in DEPLOYMENT.md when observed; it must not be inferred from local results.

## Targeted browser assertions

- Open all four guides; inspect methods, equipment, quality and limits; navigate and close them without changing field values.
- Urgent concern works for stable and empty records, focuses its heading, warns against waiting for three changed days, states that no contact was made, and supplies no symptom score/form/treatment.
- Check-in can reach the urgent signpost without saving an entry.
- Cardiovascular, head/sleep and activity regions map to existing heart-rate, sleep/fatigue or exercise context and appropriate NASA references; keyboard arrows/Enter and mobile taps work.
- Explorer tables and charts use the selected as-of day and hide later readings; returning to monitoring preserves day selection.
- Reduced motion removes CSS/connector animation, and all five requested viewports retain working controls without document overflow.
- After an actual disconnected-browser reload, previously unvisited explorer/guides/signpost open from bundled assets and a local review survives a second reload.
- Original tests retain scenario switching, transparent reference/persistence, no future data/flags, entry/edit bounds, missingness, portability/reset, print, research integrity, keyboard/accessibility and media playback checks.

## Findings corrected

The SVG activity hit area initially had a gap; it now covers the intended region. A guide heading's mixed text structure made its control difficult to locate; it now has a distinct label. A research link measured 4.43:1 contrast and was darkened before retesting. A missing-data test used the wrong fixture day and was corrected to the actual missing day without changing fixtures. Urgent navigation now pauses replay through one shared handler. Insufficient-reference guidance explicitly avoids inventing missing historical values. Early media punctuation encoding was corrected before the final rendered review.

No new runtime package or animation framework was added. Effects use immediate correct values and 180/280/320 ms CSS feedback with a reduced-motion override. Controlled folder access remains enabled; no Defender allow-list exception was needed.

## Media provenance and limitations

Captures are actual application UI. A raw review-form interaction was recorded after real browser network disconnection and an actual offline reload, with persistence verified after another reload. Still captures are composed with captions and source graphics; the video is not presented as a continuous recording. Evidence: artifacts/presentation/capture.json, verification.json, encoded-*.png and pdf-rendered/. The body SVG is original AI-assisted schematic application code, not NASA imagery or validated anatomy.

No clinical/astronaut usability study, physical-device testing, Firefox/Safari check, full screen-reader audit, penetration test or Lighthouse benchmark was run. Automated axe checks are not accessibility certification. Quota exhaustion/browser-eviction recovery are untested; multi-device/multi-tab sync is unsupported. The urgent panel has no installed mission protocol, treatment, triage or contact capability. Reminders and environment-specific rules are deferred.

Original challenge summary is independently indexed; direct full challenge retrieval failed, and the accompanying presentation was participant-reported. The full submission guide, current award definitions and earlier local cutoff still require participant reconciliation. The participant must review text/media, publish source manually if desired, use Submit for Judging and retain successful confirmation. Deployment alone is not submission.
