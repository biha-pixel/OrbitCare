# Scientific methodology

The executable definition is [lib/analysis.ts](../lib/analysis.ts), rule version `1.0.0`. These are transparent prototype engineering conventions, not NASA thresholds, clinical cutoffs, prediction or statistical significance tests. [SCIENTIFIC_LIMITATIONS.md](../SCIENTIFIC_LIMITATIONS.md) is the authoritative scope statement.

## Recorded information

| Measurement | Unit / representation | Use |
| --- | --- | --- |
| Resting heart rate | bpm | Personal comparison; comparability can be explicitly rejected |
| Sleep duration | hours | Personal comparison; 0 is distinct from missing |
| Fatigue | Illustrative ordinal categories 1–5 | Ordinal comparison, never a continuous physiological measurement |
| Exercise duration | minutes | Context only; no alert rule |

Missing values are `null`. Input ranges constrain plausible test inputs, not health or safety. Notes and timestamps carry user-supplied context. Methods and equipment assumptions appear in the expandable measurement guide and [NASA source mapping](../NASA_DATA_SOURCES.md).

## Fixed individual reference

Days **1–14** establish a reference separately per indicator, with at least **10 valid observations**. Before day 14 finishes, or if an indicator lacks ten usable observations, the reference cannot support an alert. Replay includes only observations through its selected day.

For heart rate and sleep, center is the median and spread is `1.4826 × median(abs(value − median))` (scaled median absolute deviation). With even counts, median averages the central two values. Fatigue instead uses the lower middle category to retain an ordinal center; no spread estimate is assigned. A non-comparable heart-rate entry is excluded from that indicator only.

| Indicator | Qualifying post-reference change |
| --- | --- |
| Heart rate | Absolute difference from the median ≥ `max(8 bpm, 3 × scaled MAD)` |
| Sleep | Decrease from the median ≥ `max(1.5 hours, 3 × scaled MAD)` |
| Fatigue | Increase ≥ 2 categories above the lower median category |

The implementation uses a `1e-9` floating-point tolerance at rule boundaries. The floors avoid a zero-spread reference producing an automatic deviation. No adjustment for multiple comparisons, sensor error, circadian timing or confounding establishes clinical validity.

## Persistence and quality

One or two qualifying days show **Change observed**. At least **three consecutive qualifying calendar days** show **Review suggested**. The engine walks backward from the selected day and stops at the first missing, non-comparable or non-qualifying day, and at the reference boundary. It never bridges a gap by counting only available rows. Missing reading, non-comparable heart rate and insufficient reference have separate statuses. Heart-rate persistence counts absolute qualifying deviations; it does not require the direction to remain the same.

Local actions—verify measurement, add context, request medical review—record a review on the device. They do not communicate, prove an action happened, clear a flag or override the rules. Serious acute concerns always point immediately to actual approved mission procedures and designated medical personnel, regardless of the number of changed days.

## Selected-day replay and demonstrations

[lib/replay.ts](../lib/replay.ts) derives known milestones from the existing measurements and rule results through the selected day. Reference, first change, persistence and recorded review are distinct decision states. Future observations, reviews and missingness remain hidden. Slider, next-turning-point and pausable playback navigate the same deterministic record.

Four labeled synthetic fixtures show stability, sustained change, missing information and return toward reference. The guided mission keeps those synthetic check-ins fixed and uses a separate local review workspace. They demonstrate reproducible software behavior; they are not clinical samples, evidence of outcome improvement or long-duration mission validation. The fictional Crew Assist day-24 drill has no supplied current vital signs or recovery outcome.

## Separate NASA measurements

The OSD-575 explorer preserves 56 sodium/potassium observations from four coded Inspiration4 participants across seven ground visits. It uses original mmol/L values and categorical visit positions, not equally spaced time or interpolated in-flight readings. No monitoring thresholds are applied. The original CSV checksum, transformation and all 56 value comparisons are covered by [data provenance](../NASA_DATA_SOURCES.md) and source-integrity tests. A three-day mission does not validate these monitoring rules.
