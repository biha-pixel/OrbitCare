# OrbitCare — challenge alignment upgrade

## Current team

OrbitCare was developed collectively by **Bihandu Liyanage and Nesandu Liyanage**, the registered team for Local Event **Anuradhapura, Sri Lanka**. Their joint work includes **Help a crewmate / Crew Assist**. AI_USE.md records the AI assistance disclosure.

## Latest judge-first refinement

The later judge-first pass is documented in JUDGE_READINESS.md. The official challenge Resources tab was successfully read in a real browser on 15 November 2026 (HTTP 200); its NASA links are now independently verified. The earlier retrieval failure below is historical. No claim is made that OSD-575 calibrates the synthetic monitoring rules.

## Earlier checkpoint, scope and source confidence

15 November 2026, Asia/Colombo. Starting clean revision: `25f1464`; full source archive and Git state in `artifacts/alignment-baseline/`. The previous public release `dpl_7xF44a7wDxZz46LLoUnFr2tTqY6D` remains the fallback. No agent commit or push is authorized.

Baseline rerun: 28 unit/data tests, lint, TypeScript, static production build and all 15 browser regressions passed. Baseline screenshots cover all five requested sizes in `artifacts/upgrade-alignment-baseline/`.

The official challenge's indexed original page confirms gathering indicators and enabling evaluation/action. Direct retrieval currently fails (502 in browsing; certificate-chain failure in an independent request). The full accompanying Brazilian Space Agency presentation is participant-reported, not independently reviewed. The detailed objectives/optional considerations in the participant's latest brief are therefore the working acceptance contract, not newly verified verbatim official rules. No TLS checks were disabled. Current submission-guide and local-cutoff caveats remain.

## Concrete gaps and decisions

| Priority | Existing gap | Focused implementation |
|---|---|---|
| P0 | Check-in fields explain units but not methods or comparability | Expandable four-indicator measurement guide, linked sources and visible method assumptions |
| P0 | Flags explain calculations but next actions need interpretation | Status-specific measurement/context/review guidance; preserve existing local review schema |
| P0 | Acute symptoms appear only in limitations text | Always available Urgent concern dialog directing immediately to approved procedures and designated medical personnel; no algorithm, scores or treatment |
| P0 | NASA evidence is detached from indicator use | Explicit research → recorded indicator → interpretation limit mapping |
| Required visual | No useful body exploration | Lightweight three-region educational SVG linked to selected-day readings, trends, NASA context and monitoring navigation |
| P1 | Interaction changes lack coordinated feedback | 180–320 ms opacity/position/highlight transitions; immediate numerical updates; reduced-motion override |
| Deferred | Background reminders, mission environments, complex anatomy | Preserve testing/submission time; no notification promises or environment-specific thresholds |

## Design contract

Retain navy #122235, teal #007F78, canvas #F5F7F6, ink #182B3A and amber #9A5B00, local IBM Plex fonts. The explorer is a schematic body map on a quiet operational navy surface paired with a readable evidence/record panel. Selection communicates navigation, never organ condition. Text controls duplicate spatial selection. Restrained orbital geometry stays behind headings, without continuous movement. The monitoring workspace remains the first view; no new onboarding obstructs it.

Scientific/data/storage schemas, fixtures and analysis rules remain protected. Urgent concern is independent of all measurement results and works without data. No clinical protocol is fabricated or bundled. Local review never sends a message.

## Sources inspected for this upgrade

- NASA medical care §§3.1, 3.4, 3.5: mission-specific care under flight/crew medical personnel; informs referral boundaries, not an implementable emergency protocol. https://www.nasa.gov/reference/3-0-health-and-medical-care/
- NASA training §§5.1–5.2.1: mission-dependent crew and Crew Medical Officer training. https://www.nasa.gov/reference/5-0-training/
- NASA cardiovascular adaptations: physiological research context, not validation of a pulse-based disease detector. https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/
- NASA sleep/circadian risk, Standard Measures, five hazards and human-spaceflight risks: relevance and scope boundaries. Original URLs retained in the app's source registry.
- American Heart Association pulse-measurement guidance: wrist pulse with first two fingers, timed count; terrestrial general guidance, not a NASA device protocol. https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates
- NHLBI sleep diary guidance: sleep/wake/naps and contextual diary entries. The prototype's daily aggregation and fatigue scale are explicitly separate engineering conventions. https://www.nhlbi.nih.gov/health/insomnia/diagnosis
- HRP/ongoing research and OSDR overviews were inspected for context/discovery. OSD-575 browser page has no readable text; the existing checksum-verified local CSV, source metadata and integrity tests remain the numerical integration.
- Both requested Canadian Space Agency pages were inspected. They cover radiation instrumentation and space science; they do not supply these monitoring rules. No radiation sensor or new dataset is added, and these pages are not claimed as numerical integrations.

## Implemented alignment matrix

Requirements beyond the indexed official summary follow the participant's supplied full brief, subject to the source-confidence caveat above. Tests named here were actually run locally; public results are recorded separately in DEPLOYMENT.md after release verification.

| Requirement / consideration | Implemented feature and code/UI | Verification performed | Scientific source | Remaining limitation |
|---|---|---|---|---|
| Gather relevant indicators | Four existing fields, check-in guide; `check-in-dialog.tsx`, `measurement-guide.tsx` | Existing entry/edit/zero/bounds/persistence tests; new guide navigation test | Standard Measures; AHA pulse and NHLBI diary guidance | Manual test data, no device integration or accuracy verification |
| Explain how measurements are taken | Six-part guides covering meaning, relevance, method, equipment, quality and limits; `data/guidance.ts` | All four guides opened; source links and content checked; existing entry behavior retained | AHA wrist pulse; NHLBI diary; NASA context | Terrestrial general instructions; mission-approved methods take precedence |
| Help assess changes | Fixed personal reference, original-unit delta, persistence and quality states; unchanged `lib/analysis.ts` | 28 unit/data tests; existing replay/explanation checks | NASA monitoring context only | Thresholds and detection performance are unvalidated engineering assumptions |
| Non-medical next steps | Status-specific next-step panel, recent-observation focus, local review choices; `explanation.tsx` | Review history survives reload; calculated flags unchanged; local-only language tested | NASA medical-care responsibilities; measurement-quality guidance | No treatment, medical contact or health-improvement outcome established |
| Serious acute concerns separate from trends | Global and check-in Urgent concern; `urgent-concern.tsx` | Stable and empty records, immediate navigation, focused heading, no form/score/contact, offline reopening | NASA-STD-3001 §§3.1, 3.5 and §5.2.1 training | Approved mission protocol is not installed; panel is a signpost, not triage |
| Understandable without medical training | Plain-language guides, paired reading/reference, named limits and educational body map | Keyboard/touch navigation, screenshots, automated accessibility | NASA research summaries; clearly separated conventions | No medically untrained astronaut comprehension study performed |
| Increasing independence from Earth | Bundled guides, research, explorer and urgent signpost; existing PWA/IndexedDB | Previously unvisited explorer opens after real offline reload; review persists after another reload | NASA distance hazard and medical-care requirements | Preparation needed; no autonomous medical care or communication system |
| Research-supported relevance | Research → indicator → interpretation cards; direct cardiovascular, sleep and activity mapping | Region-to-indicator/source tests, source inspection, original NASA data integrity tests | Cardiovascular adaptations; sleep/circadian risk; HRP risks; Standard Measures | Research establishes context, not a causal interpretation of these synthetic trends |
| Optional dynamic charts/interactivity | Existing plots/replay plus body-region selection and selected-day control | Scenario/replay regressions, no future table values/status markers, reduced-motion checks | Engineering interaction design | No interpolated readings, new predictions or organ scores |
| Optional accessible color information | Text labels, symbols, selected states, original-value tables and focus rings | Axe checks and five-size browser review; discovered link contrast corrected | Accessibility/design guidance, not medical evidence | Automated checks are not full accessibility or screen-reader certification |
| Optional educational human-body interaction | Three-region schematic SVG, text buttons, Tab/arrows/Enter; `health-explorer.tsx` | Heart/sleep/activity selection, correct source and trend mapping, mobile and offline checks | NASA cardiovascular, sleep and physical-conditioning context | Schematic selector, not anatomical localization or organ health assessment |
| Spaceflight hazards | Evidence scope card and indicator limitations | Content inspected; no unimplemented sensor/health claims | NASA Five Hazards | Radiation, immunity, bone density and environment are not monitored |
| Optional reminders | Deferred | No notification claim or test | Not applicable | No background or in-app scheduling implemented |
| Optional different environments | Deferred | No environment-dependent thresholds introduced | Not applicable | No ISS/Moon/Mars-specific physiological calibration |
| Optional gamification | Deliberately omitted | No scoring/reward mechanisms introduced | Not applicable | Engagement comes from reproducible investigation, not health scores |

## Final local verification and visual review

28 unit/data tests and all 23 browser checks passed. The eight new tests cover guide content/navigation, acute-pathway independence and no-contact language, check-in-to-urgent navigation, body-region/source mapping, selected-day/future exclusion, responsive accessibility/reduced motion, and real offline use with persisted review, plus missing-data action guidance and urgent replay pause. The final contextual-explorer pause correction was separately retested with selected-day freeze and offline use. Lint, TypeScript and the static build passed. All 23 checks subsequently passed against the final public production release without authentication; Edge offline smoke and public asset checksum comparisons passed. See QA_REPORT.md and DEPLOYMENT.md for release evidence.

Screenshots: `artifacts/alignment-final/` contains monitor, explorer, guide and urgent captures at 1440×900, 1920×1080, 1024×768, 390×844 and 360×800, plus sleep/activity views. Real visual inspection corrected an SVG touch-area gap and a low-contrast research link. Layout measurements show no document overflow. Motion uses 180/280/320 ms opacity/position/color/connection-line feedback; values update immediately and line interpolation stays disabled. Reduced motion removes the effects.

The existing four design skills were used directly: Frontend Design for the body/evidence composition and screenshot critique; UI UX Pro Max's actual accessibility/motion/focus searches and quick-reference checks; Vercel's freshly fetched Web Interface Guidelines for controls/disclosure/contrast; React Best Practices for a separately loaded explorer with bundled chunks prepared offline. Generic landing-page palette/font/GSAP suggestions were rejected in favor of the participant's existing system and lightweight CSS. No new skills, hooks, animation library or runtime dependency were installed for this upgrade.

## Judging readiness — subjective review

| Criterion | Improved implemented evidence | Remaining risk |
|---|---|---|
| Impact | Guided recording and appropriate review support complete more of the astronaut workflow | Real operational usefulness and health outcomes untested |
| Creativity | Interactive body-to-evidence-to-personal-record mapping integrated with replay and offline review | Educational/integration novelty, not a novel diagnostic method |
| Validity | Original units/provenance, unchanged deterministic rules, explicit limits and separate urgent signpost | No clinical validation, certified device, mission protocol or medical system |
| Relevance | Gather → understand → compare → review; explain methods; acute concerns don't depend on trends | The full challenge presentation was participant-reported; official source confidence above applies |
| Presentation | Responsive body explorer, restrained motion, updated actual-capture media and source-linked explanations | Participant review and successful final submission still required |

No official score, medical effectiveness or award outcome is implied. Reminder scheduling, complex 3D anatomy, new datasets, sensors and environment-specific rules remain outside scope.

## Crew Assist extension

At the participant’s request, the completed personal-monitoring journey now also supports helping a fictional crewmate unable to operate the software. A two-option mode selector opens shared urgent guidance before optional incident recording, a deterministic training-only Mars drill and a local printable/exportable handoff. The design extends evaluation/recording and responsibility boundaries without converting sustained monitoring flags into emergencies. NASA care/training standards inform roles and recording context; they supply no installed mission-specific protocol. No new numerical indicator, monitoring rule, real communication service or clinical outcome is claimed. The prior verified media release remains the deployment fallback until replacement checks pass. See CREW_ASSIST.md and the newest QA_REPORT.md/DEPLOYMENT.md entries for final results.
