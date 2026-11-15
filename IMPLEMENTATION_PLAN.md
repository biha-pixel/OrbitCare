# OrbitCare — approved implementation plan

This file preserves the participant-approved direction. Acceptance and actual test results belong in QA_REPORT.md; deployment status belongs in DEPLOYMENT.md. Do not describe planned work as implemented without checking it.

## 1. Vision and ownership

Help an astronaut notice sustained changes from a personal reference, inspect evidence/limits, and record review offline. The participant selected and refined the concept through AI-assisted discovery. No diagnosis, medical performance, flight certification, endorsement, or award guarantee.

## 2. Problem and user

Primary user: astronaut independently monitoring personal information. Indicators: resting heart rate (bpm), sleep (hours), fatigue (ordinal 1–5), exercise (minutes, context only). Four indicators cannot cover all spaceflight health hazards.

## 3. Value proposition

Reading → personal comparison → sustained-change rule → data quality → explanation → recorded review → offline continuity. Explainable integration and reproducibility distinguish the concept from a hypothetical generic dashboard; do not claim knowledge of competing projects.

## 4. Priorities

P0: four fixed scenarios; validated entry/edit; fixed reference; explainable rules; aligned trends/timeline; local review history; IndexedDB; genuine offline reopening; export/import/reset; evidence; separate verified OSD-575 explorer; public deployment; tests and accurate submission documents. P1: printable summary, quality scenario, guided replay, visual refinement. P2 excluded: crew roles, sync, ML, live sensors, authentication/backend.

## 5. Journeys

Judge switches stable/change scenarios and inspects a flag. Astronaut records an entry, reviews context, logs an action. Missing readings show gaps rather than reassurance. Prepared app reopens and saves offline. Research view remains separate and inspectable.

## 6. NASA resources

Use Standard Measures, NASA sleep/schedule risk, HRP risks, and verified OSD-575 sodium/potassium data. Preserve original bytes, units, codes, visits, checksum, methodology, and permissions caveat. No live telemetry claim or rule calibration from this four-person short flight. See NASA_DATA_SOURCES.md.

## 7. Scientific method

Fixed days 1–14, minimum ten comparable observations per indicator. Continuous median and 1.4826×MAD; fatigue lower median category. HR absolute change ≥max(8 bpm,3×variation); sleep decrease ≥max(1.5 h,3×variation); fatigue increase ≥2 categories. Three consecutive changed calendar days suggest review; missing/non-comparable days break persistence. All rules are engineering assumptions. See SCIENTIFIC_LIMITATIONS.md.

## 8. Design

Approved mission clinical hybrid: navy #122235, pale #F5F7F6, ink #182B3A, teal #007F78, amber #9A5B00. IBM Plex Sans; Mono for mission clocks. Aligned record and explanation rail, progressive disclosure, accessible tables, responsive reading order. DESIGN.md records composition.

## 9. Skills

Project-scoped Frontend Design, Web Design Guidelines, and React Best Practices; retain licenses and source revisions. No global installation or hooks. Omit overlapping Impeccable/UI UX Pro Max/Python Webapp Testing runtime setup. Use TypeScript Playwright.

## 10. Architecture

Retain Next.js 16.4.6/React19.3/Tailwind4.3.3. Static export; disable cacheComponents and partialPrefetching together. One route with monitor/research/method/data views; pure analysis, reducer/context, native IndexedDB, bundled evidence/research, generated production service worker. No paid service or credentials.

## 11. Models and analysis

Versioned workspace, check-in, reference summary, computed analysis, review event, evidence, separate research observation/provenance. Validate → select as-of observations → quality/reference → comparison/persistence → deterministic explanation → display/local save. Recompute imported flags; never trust imported analysis.

## 12. Data separation

Fixed 28-day synthetic fixtures share a 14-day reference: stable, sustained change, missing/non-comparable, return toward reference. User test entries retain their own origin. NASA observations use a separate model/view and cannot enter monitoring. No runtime random fixtures.

## 13. Phases and acceptance

Setup ≤20 min; analysis/fixtures/tests ~90 min; core UI/workflow ~3 h; offline/portability ~90 min; NASA explorer ≤60 min; integrated checks/deployment ~90 min. Gates: hand-calculated rules pass; complete keyboard/mobile workflow; real offline reload/save/export; exact source match; public release without sign-in. P1 only after core acceptance.

## 14. Tests

Numerical boundaries, reference sufficiency, ordinal handling, persistence/gaps, no future leakage; validation, storage/reload/edit/reset; whole-import validation and round trip; all research values match source; keyboard/contrast/responsiveness; real production offline reopening and first-visit limits; console/build/type/lint checks. Record actual outcomes only.

## 15. Deployment

Deploy the tested static artifact directly to Vercel; Cloudflare Pages fallback. No commit or push by the agent. Public incognito checks must pass. Offline readiness requires a verified complete cache; update actions must warn before reloading. External references need internet.

## 16. Demo

27–29 seconds: notice sustained simulated changes, inspect personal comparison/rule, genuinely disconnect/reload, record a review. English captions; actual screen capture; no generated NASA branding. At most seven actual-screenshot slides as fallback. See DEMO_SCRIPT.md.

## 17. Submission

Prepare README, PROJECT_DESCRIPTION, NASA_DATA_SOURCES, SCIENTIFIC_LIMITATIONS, AI_USE, REFERENCES, DEMO_SCRIPT, SUBMISSION_CHECKLIST accurately from the finished app. Public app/demo/final-project links without registration. Reconcile participant-supplied guide rules. Save Progress is insufficient; user must verify successful Submit for Judging confirmation if agent lacks account access.

## 18. Risks/fallbacks

Earlier local cutoff unverified; eliminate P1 if found. If research cannot be verified, fall back honestly to cited research plus synthetic monitoring. Offline failure must be fixed rather than claimed from persistence. Avoid clinical authority, unnecessary dependencies, backend/AI expansion, or polish that delays submission.

## 19. Deadline

Participant-confirmed deadline: 15 November 2026, 23:59 Asia/Colombo. Earlier Anuradhapura local judging cutoff unverified. Target public deployment by 16:00; feature freeze 19:00; regression/docs 19:00–20:30; demo 20:30–21:30; fields 21:30–22:30; Submit for Judging and confirmation 22:30–23:00; contingency until 23:59. Protect at least four hours for release/demo/submission.

## 20. Judging readiness

Subjective design potential only: Impact 4/5, Creativity 3.5/5, Validity 3.5/5, Relevance 4.5/5, Presentation 4.5/5. Evidence must be the actual workflow, reproducible calculations, provenance, honest limits, working public artifact and concise demo. Validity/Relevance first, Creativity/Presentation second. Current 2026 award definitions/eligibility unverified; historical categories are positioning only. Selection cannot be guaranteed.
