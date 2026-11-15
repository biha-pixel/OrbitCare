# OrbitCare product contract

The participant chose astronaut self-monitoring, personalized reference periods, explainable sustained-change rules, offline operation, a separate verified NASA research view, and a focused polished submission. AI assisted discovery and implementation; the participant selected and refined the product direction.

Audience: an astronaut independently recording and reviewing monitoring information. A judge should see a complete reading → comparison → explanation → review workflow within 30 seconds.

Indicators: resting heart rate (bpm), sleep (hours), ordinal fatigue (1–5), exercise (minutes, context only). No diagnosis, treatment, emergency triage, clinical performance claim, flight certification, or NASA endorsement.

Reference: fixed days 1–14, at least 10 comparable observations per indicator. Continuous medians and scaled MAD; fatigue lower median. Illustrative engineering rules: heart rate absolute delta ≥ max(8 bpm, 3 scaled MAD); sleep reduction ≥ max(1.5 h, 3 scaled MAD); fatigue increase ≥ 2 categories. Three consecutive days suggest review. Missing/non-comparable observations break persistence. Never use future observations or silently move the reference.

P0: deterministic stable/change/missing/return scenarios; daily check-ins; original-unit plots; evidence and assumptions; timeline; review log; IndexedDB; real production offline reopening; versioned JSON import/export; reset; OSD-575 sodium/potassium explorer; accessible responsive UI; tests and accurate submission documents.

P1 only after P0: printable review, measurement-quality scenario, guided playback, visual refinement. Exclude backend, authentication, cloud AI, synchronization, sensor integration, and disease prediction.

Deadline confirmed by participant: 15 November 2026, 23:59 Asia/Colombo. Earlier local judging deadline unverified. Freeze features at 19:00; target successful judging submission by 23:00. Do not commit or push: the participant will do so manually.
