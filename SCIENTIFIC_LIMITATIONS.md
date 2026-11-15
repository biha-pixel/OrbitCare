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
