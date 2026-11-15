# OrbitCare — prepared submission text

Review against the official form's actual field limits and current guide before pasting. Current rules that the agent could not independently verify remain provisional. Do not describe a source repository as updated until the participant manually commits/pushes.

## Project name

OrbitCare

## High-level summary

OrbitCare helps an astronaut understand sustained changes from a personal reference and record a review—even offline. Synthetic mission scenarios connect heart rate, sleep, and fatigue to transparent rules, data-quality explanations, and local review history. A separate NASA OSD-575 explorer preserves real serum observations, units, and provenance. This research prototype supports inspectable monitoring, not diagnosis or flight-certified medical decisions.

## Public demonstration

https://orbitcare-eight.vercel.app/demo/

Direct video if the field requires a media file: https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4

Fallback presentation: https://orbitcare-eight.vercel.app/demo/OrbitCare-seven-slides.pdf

Choose one primary demonstration format according to the official guide. The video is 28.4 seconds; the fallback PDF has seven pages including title/closing slides.

## Final project

https://orbitcare-eight.vercel.app/

## Detailed description

Use PROJECT_DESCRIPTION.md after participant review. It describes the implemented journey, innovation, NASA integration, technology, and limitations.

## Use of Super Intelligence / AI

OpenAI Codex assisted with a structured discovery interview, source inspection, architecture, implementation, synthetic fixtures, testing, interface refinement, documentation, deployment, and demo tooling. I selected and refined the product direction and retain responsibility for the solution and claims. Runtime explanations are deterministic and call no cloud model. Synthetic monitoring data is labeled and kept separate from original NASA research measurements. No AI diagnostic performance is claimed. See AI_USE.md for the full disclosure and update it for any further tools I actually use.

## NASA data and resources actually used

- NASA Standard Measures: repeated, contextual human-spaceflight monitoring research.
- NASA sleep and irregular schedules risk: sleep/circadian context and limits.
- NASA HRP risks: physiological adaptation context.
- NASA OSDR OSD-575, DOI 10.26030/mc5d-p710: 56 original sodium/potassium observations from four Inspiration4 participants and seven ground visits. Original mmol/L values, participant/visit labels, methodology, checksum, and reproducible transformation are preserved in a separate research view. These data do not calibrate or validate monitoring thresholds.

Exact URLs and attribution: NASA_DATA_SOURCES.md and REFERENCES.md. Cite actual integrations rather than every resource examined.

## Other references

Next.js, React, TypeScript, Tailwind, Recharts, Zod, Lucide, IBM Plex fonts, Playwright/Vitest/axe, and the installed design/React instruction skills; see REFERENCES.md for actual uses and licensing. No NASA branding or endorsement is claimed.
