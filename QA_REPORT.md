# OrbitCare - guided-care release verification

## Final submission-media verification — 15 November 2026, 15:56 Asia/Colombo

Current production: **dpl_BrXpy5kcdiZ86cXFZRstmvDMijaV**. This pass corrected media framing and consistency without changing application behavior or the PDF. Earlier full-suite results below remain historical implementation evidence.

- Confirmed the actual encoded defect at 12.5–13 seconds; replaced the affected scene with an actual day-24 explanation showing 60 → 71 bpm, +11 bpm, three consecutive changed days, calculation and the unvalidated-engineering-rule label. The video now uses steady reference/replay cards and explanation captures, plus the retained recorded offline review.
- FFprobe: 28.000 seconds, 1920×1080, 30 fps, 840 H.264/yuv420p frames. FFmpeg decoded the complete MP4 without error. Encoded samples cover all scenes and 12, 12.5, 13, 13.1, 13.2, 13.5 and 14 seconds; the corrected explanation, transition and offline confirmation were visually inspected.
- Timed eight-scene transcript, submission media description and AI-use disclosure match the final cut. README opening-flow wording now matches the completed progressive investigation. The project description distinguishes three monitored indicators from the contextual exercise measurement. No outdated team claim is present.
- PDF hash is unchanged; seven native 16:9 pages, both names and Anuradhapura on the title. Original OSD-575 labels, 56 observations/four participants/seven visits/mmol/L, scientific separation and unvalidated-capability statements remain accurate. Title was visually inspected; no redesign or regeneration.
- Lint and all 31 unit/data tests passed; production build including TypeScript passed. Existing demonstration test plus all five judge-journey tests passed locally and again on the final public deployment: six checks per environment, including offline reload, missing/non-comparable data, as-of replay, four viewport sizes, keyboard/reduced motion and axe checks. The full 28-test suite was not rerun for this media-only correction.
- Additional fresh demo checks: playback and seeking, 28-second metadata, eight transcript entries, keyboard expansion, zero axe violations, no document overflow at 390/360 widths, team/original creator credits, no page errors. Edge public offline reload, local review persistence and bundled NASA research passed.
- Protected preview and final unauthenticated public bytes match local HTML, video, PDF and SW; public app, poster and slide HTML also match local files. All 48 protected application/data/test/license/PDF file hashes remain unchanged. No qualifying Next.js feedback issue was retained.

Evidence: `artifacts/media-final/local-verification.json`, `public-verification.json`, `preview-verification.json`, `pdf-verification.json`, `preservation.json`, `explanation-provenance.json`, public player screenshots and original defect frames; encoded-frame provenance in `artifacts/presentation/encoded-frames/verification.json`. No human usability result or completed judging submission is claimed.


## Team-membership update verification — 15 November 2026, 15:26 Asia/Colombo

Current production: **dpl_9JcQtRhUEeVP1cWiFKJRdG2xjwvu**. This was a documentation/media-credit update; the prior full 28-check application regression results below remain the implementation baseline.

- Current team: Bihandu Liyanage and Nesandu Liyanage; Local Event: Anuradhapura, Sri Lanka; registration/approval supplied by Bihandu.
- Build/TypeScript and renderer lint passed; all 31 unit/data tests passed.
- Existing local demonstration test and full fresh-judge journey test passed. Existing public demonstration playback/PDF test passed; Edge public offline/review persistence passed.
- Exact source hashes confirm 47 protected application, NASA data, test, original-license, MP4 and poster files were unchanged by this task.
- Exported PDF contains both names and the correct event; exactly seven 16:9 pages; slides 2–7 match previous rendered pixels and extracted text exactly. The title slide was visually inspected.
- Existing actual encoded video scenes and MP4 metadata were inspected. No outdated membership statement appears. Video was not regenerated and retains the same SHA-256 and 28.000-second duration.
- Public credits were checked in fresh desktop/mobile contexts for names, local event, original creator attribution and absence of horizontal overflow. Public HTML, slide HTML, PDF, MP4 and SW bytes match the verified local files.
- No tests or application credits/code were modified; the application’s existing generic credits needed no team correction. Copyright and documented Bihandu/AI-development attribution remain intact. No Nesandu contribution was invented.

Evidence: `artifacts/team-update/`. Current source/submission references to solo membership were removed; explicitly historical descriptions of Bihandu’s earlier individual participation remain accurate. No qualifying Next.js feedback issue was retained in this pass.

## Previous judge-first verification — 15 November 2026, 14:58 Asia/Colombo

This section supersedes the earlier 23-test release results below. Final production: dpl_FF9aFyLmA98toA4uavzPuwDFnqo3. Software testing does not establish clinical validity or human usability.

| Check | Final observed result |
|---|---|
| Unit, calculation, validation and research integrity | 31 tests passed across four files; all 56 original NASA measurements preserved |
| TypeScript / ESLint / production build | Passed; final static artifact and 48-asset offline cache prepared |
| Complete local browser suite | All 28 checks passed before promotion |
| Complete public browser suite | All 28 checks passed on the final public alias in fresh unauthenticated contexts |
| Judge journey | Open → change scenario → investigate → manual replay → calculation/quality → NASA evidence → local review passed |
| Offline journey | Real network disconnection, reload, unvisited views, local action and second-reload persistence passed |
| Missing/non-comparable journey | Distinct uncertainty narratives; broken persistence; no future gaps, review markers or review notes in earlier states |
| Replay edge cases | Empty workspace stays on day 1; explorer follows the selected indicator; optional playback pauses during investigation interaction |
| Accessibility | Axe WCAG 2 A/AA and 2.1 AA passed for tested views, dialogs, expanded evidence and saved-review state; keyboard focus and reduced motion passed |
| Responsive/visual evidence | Fresh opening, replay, explanation, evidence and explorer captures at 1440×900, 1920×1080, 390×844 and 360×800; no horizontal document overflow; main investigation action within the viewport |
| Original animated logo | Original SVG and CSS have no diff; continuous 1.8-second pulse and seven-second orbit verified; both stop under reduced motion |
| Microsoft Edge | Final local and public offline/persisted-review/research smoke passed without page errors |
| Media | FFprobe: 28.000-second 1920×1080/30-fps video; actual recorded replay and disconnected-browser review; seven-page 16:9 PDF rendered and inspected |
| Release integrity | Protected preview and public SW/MP4/PDF hashes match tested local files |
| Preservation | Algorithm, schemas, fixtures, NASA data, persistence, offline hook and service-worker generator unchanged; original logo restored |
| Diff / framework feedback | `git diff --check` passed; reporting pass retained no qualifying Next.js issue |

Visual defects discovered during this pass were fixed before release: mobile action below the fold, legacy mission-day stacking/overlap, saved-review timestamp contrast, and inline NASA link differentiation. A crop that included the later reload was corrected in the actual offline-action video scene and the encoded result inspected again. Tests were updated to explicitly open the new progressive investigation layer, preserving the original assertions.

Evidence: `artifacts/upgrade-judge-before/` (live baseline), `artifacts/judge-final/` (tested final local build), `artifacts/judge-public/` (final public captures and original-motion proof), and `artifacts/presentation/` (capture metadata, PDF renders and encoded video frames). The numerical source and original logo preservation check is stored in `public-verification.json`. No human usability-test outcome is invented.

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
| Microsoft Edge | Local artifact and public release passed actual offline reload, persisted review, bundled research and no page-error smoke |
| Visual review | Real captures at 1440x900, 1920x1080, 1024x768, 390x844 and 360x800, including all three systems, guidance and urgent concern; no document overflow |
| Video | FFprobe: 28.000 seconds, 1920x1080, 30 fps, H.264/yuv420p, 1,236,621 bytes; encoded scenes inspected |
| Presentation | Exactly seven 16:9 PDF pages (1440x810 points); every actual exported page rendered with PyMuPDF and visually inspected |
| Source/data preservation | Protected-file diff empty; original checksum and all 56 selected NASA values pass existing tests |
| git diff --check | Passed, ordinary Windows line-ending notices only |

The complete local browser suite passed all 23 checks (2.2 minutes); after a final one-line contextual-navigation pause correction, the affected body-selection/replay and offline-explorer tests both passed again (9.3 seconds). The eighth new test explicitly verifies missing-data action guidance, local no-request language, recent-observation focus and urgent replay pause. All 23 checks also passed against final production dpl_EMS6sxHxe1j6RDLhCCDqaVuqoapc in fresh unauthenticated Chromium contexts (2.2 minutes). Edge public offline smoke passed. Public SW/MP4/PDF checksums match local verification; DEPLOYMENT.md records the artifact.

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

The SVG activity hit area initially had a gap; it now covers the intended region. A guide heading's mixed text structure made its control difficult to locate; it now has a distinct label. A research link measured 4.43:1 contrast and was darkened before retesting. A missing-data test used the wrong fixture day and was corrected to the actual missing day without changing fixtures. Urgent navigation pauses replay through one shared handler. Contextual explorer navigation also pauses replay, with a timed regression assertion. Insufficient-reference guidance explicitly avoids inventing missing historical values. Early media punctuation encoding was corrected before the final rendered review.

No new runtime package or animation framework was added. Effects use immediate correct values and 180/280/320 ms CSS feedback with a reduced-motion override. Controlled folder access remains enabled; no Defender allow-list exception was needed.

## Media provenance and limitations

Captures are actual application UI. A raw review-form interaction was recorded after real browser network disconnection and an actual offline reload, with persistence verified after another reload. Still captures are composed with captions and source graphics; the video is not presented as a continuous recording. Evidence: artifacts/presentation/capture.json, verification.json, encoded-*.png and pdf-rendered/. The body SVG is original AI-assisted schematic application code, not NASA imagery or validated anatomy.

No clinical/astronaut usability study, physical-device testing, Firefox/Safari check, full screen-reader audit, penetration test or Lighthouse benchmark was run. Automated axe checks are not accessibility certification. Quota exhaustion/browser-eviction recovery are untested; multi-device/multi-tab sync is unsupported. The urgent panel has no installed mission protocol, treatment, triage or contact capability. Reminders and environment-specific rules are deferred.

Original challenge summary is independently indexed; direct full challenge retrieval failed, and the accompanying presentation was participant-reported. The full submission guide, current award definitions and earlier local cutoff still require participant reconciliation. The participant must review text/media, publish source manually if desired, use Submit for Judging and retain successful confirmation. Deployment alone is not submission.
