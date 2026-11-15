# OrbitCare — project description

## High-level summary

OrbitCare helps an astronaut understand sustained changes from a personal reference and record a review action without continuous Earth connectivity. Clearly labeled synthetic mission scenarios combine transparent comparisons, original-unit trends, data-quality explanations, and local review history. A separate NASA OSD-575 explorer presents actual pre-/post-flight serum observations with original units and provenance. OrbitCare is a research prototype, not a medical or flight-certified system.

## Problem and solution

An isolated reading gives little insight into sustained individual change or whether missing information makes comparison unreliable. Long-duration missions also make continuous access to Earth-based support an unsuitable assumption. OrbitCare demonstrates an understandable, locally preserved monitoring-to-review workflow for an astronaut independently reviewing personal information.

The app records resting heart rate (bpm), sleep (hours), fatigue (an explicitly defined illustrative 1–5 scale), and contextual exercise duration (minutes). Fixed days 1–14 establish the reference, requiring at least ten valid observations per indicator. Continuous measurements use the median and scaled median absolute deviation; fatigue uses the lower median category. Explicit prototype rules show a change and suggest review after three consecutive qualifying calendar days. Missing/non-comparable days interrupt persistence and have separate explanations.

Aligned plots and a selectable mission timeline reveal what was available on each day, hiding later readings. Selecting an indicator exposes the reference, current value, difference, persistence, rule, research context, origin, uncertainty, and limitations. Local review actions record verifying a measurement, adding context, or requesting medical review. They neither send a communication nor clear a computed flag.

The opening view presents compact mission context, clearly labeled synthetic scenarios, reference-to-current readings and one primary action: Investigate the change. Calculations, charts, tables and review history remain available inside an expandable investigation. Mission Decision Replay guides manual exploration from reference establishment through the first changed reading, consecutive persistence and review. A Next turning point control derives transitions from the original deterministic analysis. Optional playback can be paused; all stages also work without animation. Future observations, missingness and review events stay hidden in earlier states. NASA research-to-feature cards explain the cardiovascular, sleep, longitudinal and medical-care connections and their limits. The original-value NASA explorer remains separate.

Four deterministic scenarios demonstrate stability, sustained change, incomplete information, and return toward the reference. Judges can reproduce the same behavior without registration. Entries can be added or deliberately edited; accessible tables, validated JSON portability, workspace reset, and a printable review record make the workflow inspectable.

An expandable guide to the four recorded measurements explains what is recorded, why it matters, practical methods, equipment assumptions and interpretation limits. Status-specific next steps suggest checking measurement quality, recording context, inspecting recent observations and using designated medical personnel or approved procedures when appropriate. Saving a review is always a local action.

The interactive human health explorer links a schematic cardiovascular, head and muscle region to the existing selected-day heart-rate, sleep/fatigue or exercise record. Spatial controls have keyboard and text alternatives. Region highlighting is educational navigation, never an organ-health conclusion. Direct NASA research cards distinguish context from unvalidated thresholds.

Crew Assist, reached through **Help a crewmate**, extends this participant-proposed concept to same-device assistance when a fictional crewmate cannot operate the software. It reuses the urgent guidance before offering optional incident documentation. Circumstances, measured-observation notes, missing information, actions and contact statements carry user-source and timestamp labels. Blank values stay unknown; historical observations are included only after an explicit fictional-identity confirmation and selected-day snapshot. A deterministic Mars day-24 drill demonstrates software steps without treatment, a medical score or a recovery claim. Incident records have their own bounded local store and JSON import/export; readable text and browser Print / Save as PDF prepare a handoff without notifying anyone. No mission-specific emergency protocol has been supplied or installed. This is not synchronized multi-device crew access or a secure production medical record.

An always available Urgent concern panel separates serious acute concerns from gradual monitoring. It immediately directs users to approved mission emergency procedures and the designated medical personnel, independently of trends or missing data. It contains no treatment protocol, emergency diagnosis or communication function. It never asks the user to wait for three changed days.

After **Offline ready** confirms preparation, the production application can reopen without network access and continue local analysis, entry, review, evidence inspection, and export. Persistence alone is never presented as proof of offline reopening.

## NASA science and data

NASA Standard Measures supports the relevance of repeated contextual human-spaceflight measurement. NASA sleep/schedule and human-spaceflight risk resources inform evidence panels while making clear that these indicators are incomplete. These resources do not provide OrbitCare's thresholds.

The separate OSD-575 view contains 56 original sodium/potassium observations: four Inspiration4 participants and seven ground sampling visits. It preserves mmol/L, coded participants, visit labels, methodology, an original checksum-verified CSV, and a reproducible transformation. Positions represent categorical sampling visits, not equal elapsed time. The app invents no in-flight data, applies no monitoring alerts to laboratory values, and makes no disease/causal interpretation. A three-day mission does not validate long-duration monitoring rules.

## Team

OrbitCare has two officially registered NASA Space Apps Challenge 2026 team members:

- Bihandu Liyanage
- Nesandu Liyanage

Local Event: **Anuradhapura, Sri Lanka**. Nesandu’s team membership has been approved by Bihandu. This current membership update does not change the documented original project ownership, development history or AI-use attribution.

## Distinctive contribution and ownership

Bihandu Liyanage selected and refined the core direction through an AI-assisted interview: personalized baselines, selected indicators, explainable persistence, astronaut self-review, offline continuity, separate real research data, and a scenario-led presentation. OrbitCare connects reading → comparison → quality assessment → explanation → recorded review → offline continuity. This is a product integration contribution, not a claim of clinical novelty or superior diagnostic performance.

## Implementation and limits

A static Next.js/React application runs deterministic TypeScript analysis locally, persists work in IndexedDB, and prepares production assets through a generated service worker. No backend, paid AI key, sign-in, or runtime NASA request is needed. The interface emphasizes understandable change instead of an opaque health score.

The prototype demonstrates reproducible software behavior. Clinical performance, instrument uncertainty, astronaut human-factors suitability, operational usefulness, and flight certification require future evaluation. The three monitored indicators and contextual exercise record do not address every spaceflight hazard or establish health and safety. See SCIENTIFIC_LIMITATIONS.md for exact rules and failure modes.
