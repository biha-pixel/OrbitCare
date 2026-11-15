# Scientific methodology and limitations

OrbitCare is a research/hackathon prototype. It does not diagnose, prescribe, predict disease, provide emergency triage, or establish astronaut health, fitness, or safety. It is not clinically validated or flight certified. No NASA endorsement is implied.

## Indicators and input guardrails

| Indicator | Representation | Accepted input | Interpretation |
|---|---|---|---|
| Resting heart rate | bpm | 20–250 or missing | Personal comparison; comparability may be excluded |
| Sleep | hours | 0–24 or missing | Reported duration, not sleep quality |
| Fatigue | ordinal 1–5 | integer 1–5 or missing | Illustrative self-report, not a validated instrument |
| Exercise | minutes | 0–1,440 or missing | Context, not conditioning or prescription |

These bounds are input guardrails, not medical normal ranges. Blank is missing; zero is valid for sleep/exercise. Fatigue anchors: 1 no fatigue, 2 slight, 3 moderate, 4 high, 5 very high. Differences are categories, not percentages or continuous physiological quantities.

## Exact prototype methodology — rule version 1.0.0

Fixed days 1–14 form the reference. Require at least ten valid comparable observations independently for each indicator and a completed reference period. Later observations never silently update it. Deliberate reference edits recalculate comparisons; this is not an immutable clinical audit system.

For heart rate and sleep, center = median(valid reference values); MAD = median(abs(value − center)); robust variation = 1.4826 × MAD. Fatigue uses the lower median category.

| Indicator | Daily change condition |
|---|---|
| Resting heart rate | abs(current − center) ≥ max(8 bpm, 3 × robust variation) |
| Sleep | center − current ≥ max(1.5 h, 3 × robust variation) |
| Fatigue | current − reference category ≥ 2 categories |

These constants, reference period, minimum count, robust statistic, and persistence requirement are **engineering assumptions**, not NASA or clinical thresholds. Floating comparisons use a 1e−9 boundary tolerance.

One or two consecutive qualifying days show **Change observed**; three or more show **Review suggested**. A non-qualifying, missing, or non-comparable calendar day breaks the sequence. Missing days are never skipped to extend persistence. A reading marked non-comparable is retained, but its heart rate is excluded from reference/comparison; sleep and fatigue keep separate rules. Timeline replay excludes future observations. No interpolation is used.

**No sustained deviation** describes the rule, not health or safety. Reference establishment, insufficient reference, missingness, and non-comparability have distinct states. Acknowledgment does not change calculated status. Returning toward reference does not prove clinical recovery.

## Uncertainty and failure modes

- A stable reference may still be unhealthy. Normal mission adaptation can make a fixed comparison inappropriate.
- Device calibration, repeatability, collection conditions, timing, and measurement uncertainty are unknown. Scaled MAD describes reference variation, not accuracy, a confidence interval, or diagnostic probability.
- False positives/negatives are unquantified. Synthetic fixtures cannot establish sensitivity, specificity, efficacy, or real astronaut performance.
- Three-day persistence can delay review. Symptoms or isolated concerning measurements may require mission medical procedures regardless of the app's flags.
- These indicators cannot establish cardiovascular conditioning, cognitive readiness, immune response, bone/muscle health, radiation injury, or complete well-being.
- Self-report and manual entry can be wrong. Exercise duration lacks intensity; sleep duration lacks architecture/quality. The app cannot independently verify a reading.
- Review actions are local notes. **Request medical review** records intent without transmitting a message or replacing mission procedures.

## NASA research boundaries

OSD-575 sodium/potassium observations appear only in a separate descriptive view. Four humans contributed seven visits each; these are repeated observations, not 28 independent astronauts per analyte. Inspiration4 lasted about three days; the selected samples are ground-collected before/after flight, not continuous or in-flight telemetry.

Sampling visits have unequal elapsed-time spacing. The view uses categorical positions and individual points with a pre-/post-flight gap. The small cohort, research context, mission duration, sampling design, and absent confounder analysis preclude diagnostic, causal, general-population, or long-duration prediction claims. The dataset does not calibrate or validate OrbitCare's monitoring rules. Only the selected subset has been checked for completeness; other source variables contain missingness.

## Software limits

Browser records are unencrypted by OrbitCare and subject to clearing/eviction. No multi-tab/multi-device synchronization exists. Offline reopening needs prior online preparation; external pages need internet. Browser connectivity does not prove reachable Earth communications. Automated tests demonstrate software behavior, not clinical validity or complete accessibility certification.

## Guided recording, body exploration and urgent concerns

The expandable measurement guides describe methods and equipment assumptions. Manual pulse guidance draws on the American Heart Association's terrestrial educational instructions, not a NASA-certified acquisition protocol. No device is connected or verified. The sleep guide uses an explicit preceding-24-hour aggregation convention; consistent intervals and avoiding duplicate sleep are engineering choices informed by diary practice, not a validated mission measurement system. The fatigue scale remains illustrative. Context notes do not adjust thresholds automatically; only heart rate has the existing explicit comparability exclusion.

The SVG body is a deliberately simplified educational map, created through AI-assisted code. Heart, head and muscle highlights are topic selection, never measured organ condition. Associated charts use existing selected-day observations and references; exercise remains duration context without a flag. There are no new organ, brain, muscle, radiation, bone-density or fitness measurements. The drawing is not suitable for anatomical instruction or clinical localization.

The Urgent concern panel is accessible independently of readings, reference sufficiency and three-day rules, including from check-in and offline. It directs immediate use of approved mission emergency procedures and the designated Crew Medical Officer or appropriate support according to those procedures. It supplies no treatment algorithm, diagnosis, symptom score, CPR steps, medication, contact service or actual mission protocol. Opening it does not alert anyone and should not delay real procedures. A normal-looking trend does not rule out an emergency. Ordinary review actions remain local notes and retain the existing export schema.

NASA's public care/training requirements justify the responsibility boundary; they do not certify this interface. Plain language, keyboard controls and automated accessibility checks have been exercised, but comprehension by medically untrained astronauts has not been established through a user study.

## Crew Assist and incident handoff

Crew Assist reuses the urgent signpost independently of flags. No approved mission-specific emergency protocol is installed; there is no protocol verification/installation system, emergency detection, symptom triage, treatment instruction, alarm or communication backend. NASA care/training standards inform responsibility boundaries and the rationale for recording encounters; the fields and drill are unvalidated engineering designs, not NASA-approved procedures or medical training.

Current observations are free-text user reports, not sensor readings or validated vital-sign acquisition. Units, methods, event/observation times and contact details are user supplied; blank values remain unknown. A user-reported confirmation is not independently verified. Local creation/save/import times are separate from incident time; form times use the device timezone and exports use UTC. The drill uses a fixed fictional clock and no clinical outcome.

Historical context defaults to excluded. An explicit fictional-identity confirmation copies only the selected mission day and review events through that day, preserving source labels and original times. OrbitCare cannot verify the identity match, and these values are never promoted to current incident observations. Emergency records remain separate from monitoring flags and schema-v1 workspace exports.

Incident JSON and text export and browser Print / Save as PDF are local actions, not handoff transmission. Records use a separate key in the existing IndexedDB store, with at most 50 incidents; storage failure is reported and a session handoff can be exported. Saved records are collapsed on entry and can be explicitly deleted; downloaded copies remain outside the app. Storage is unencrypted by OrbitCare, has no user authentication or access control, and may be cleared or evicted. Same-device access only; no cloud/multi-tab/multi-device crew synchronization or production-grade medical data security is claimed. Use synthetic information for public demonstrations.
