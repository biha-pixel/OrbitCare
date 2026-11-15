# References and third-party attribution

## NASA resources actually used

- [NASA Standard Measures](https://www.nasa.gov/reference/standard-measures/): longitudinal/contextual human research.
- [NASA sleep/schedule risk](https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/): sleep/circadian context.
- [NASA HRP risks](https://www.nasa.gov/hrp/risks/): physiological adaptation context.
- [NASA OSDR OSD-575](https://osdr.nasa.gov/bio/repo/data/studies/OSD-575), DOI [10.26030/mc5d-p710](https://doi.org/10.26030/mc5d-p710): selected original serum observations. See NASA_DATA_SOURCES.md for exact source and transformations.
- [OSDR terms/citation guidance](https://science.nasa.gov/reference/osdr-help-terms-and-conditions/).

## Challenge and planning

- [2026 selected challenge](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/).
- [Submission guide page](https://www.spaceappschallenge.org/resources/project-submission-guide/): the current PDF was not independently retrieved by the implementation agent. Participant-supplied rules require final reconciliation.
- [Historical 2025 award definitions](https://www.spaceappschallenge.org/2025/awards/): positioning only; not confirmed 2026 eligibility/definitions.

Examined/excluded scientific resources are listed separately in NASA_DATA_SOURCES.md and are not claimed as integrations.

## Software and fonts

Direct runtime dependencies: Next.js, React/React DOM, Tailwind CSS, Recharts, and Zod (MIT); Lucide icons (ISC). IBM Plex Sans/Mono are IBM fonts distributed under SIL Open Font License 1.1 through Fontsource, bundled locally with their package notices.

Development tools include TypeScript (Apache-2.0), ESLint (MIT), Vitest/Vite (MIT), Playwright (Apache-2.0), axe-core/Playwright integration (MPL-2.0), and CSV Parse (MIT). Optional icon regeneration uses Sharp (Apache-2.0), available through Next.js. package-lock.json records exact resolved packages; each distribution retains its full notices and transitive terms.

## Agent skills

- [Anthropic Frontend Design](https://github.com/anthropics/skills/tree/1780c5e5a552fd4d1c9d6a7b0cab26b0c2bef064/skills/frontend-design), commit `1780c5e5a552fd4d1c9d6a7b0cab26b0c2bef064`, Apache-2.0.
- [Vercel skills](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62), commit `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`, MIT: React Best Practices and Web Design Guidelines.
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): interface review reference retrieved during implementation.

Skills are project-scoped copies in `.agents/skills/`, with licenses and source records. They add no runtime service or hooks. The visual upgrade additionally installed [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d643997c82e94742dd3bee43210b0198e8bbba3d), commit `d643997c82e94742dd3bee43210b0198e8bbba3d`, MIT. Its standard-library Python searches informed chart labeling, touch spacing, readable typography, and accessible interaction; the participant-approved palette and fonts took precedence over generic search recommendations.

[Impeccable](https://github.com/pbakaus/impeccable) critique/polish references were inspected for evidence-based hierarchy and refinement principles, without installing its engine, hooks, live mode, or detector. No automated Impeccable audit is claimed. Anthropic Webapp Testing remains omitted in favor of the existing TypeScript Playwright suite.

Final media uses actual Playwright screen captures, FFmpeg composition, local IBM Plex fonts, and the original OrbitCare mark. A local, non-runtime PyMuPDF 1.26.7 verification wheel rendered the exported PDF pages for visual inspection; it is not bundled with the app or added to its dependencies.

OrbitCare code retains the existing MIT license, copyright Bihandu Liyanage 2026. Third-party sources retain their terms. No NASA branding, endorsement, or certification is claimed.

## Guided-care upgrade sources actually used

- [NASA cardiovascular adaptations](https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/): heart-rate relevance and limitations, not a diagnostic rule.
- [NASA five hazards](https://www.nasa.gov/hrp/hazards/): hazard context and explicit monitoring boundaries.
- [NASA health and medical care](https://www.nasa.gov/reference/3-0-health-and-medical-care/), §§3.1, 3.4, 3.5: mission-specific medical responsibilities and scope.
- [NASA medical training](https://www.nasa.gov/reference/5-0-training/), §5.2.1: crew medical training context; no emergency protocol copied.
- [American Heart Association pulse guidance](https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates): general manual wrist pulse method, not device certification or clinical thresholds.
- [NHLBI diary guidance](https://www.nhlbi.nih.gov/health/insomnia/diagnosis): sleep/wake/nap and surrounding-context recording. OrbitCare's daily aggregation and fatigue scale remain separately labeled conventions.

The human-body SVG is original AI-assisted application code, not NASA imagery or a medical illustration licensed from a third party. It is a schematic educational selector. Media contains actual application captures and disclosed AI-assisted code-defined graphics. No image-generation model, astronaut likeness or NASA insignia was added. The current guide's media/disclosure requirements still need participant reconciliation.

## Final judge-first refinement

- [Official 2026 health-monitoring challenge resources](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources): retrieved by browser; verifies the listed NASA overview resources.
- [NASA Space Apps GO Team resource guidance](https://github.com/nasa/spaceapps/discussions/1827): current clarification that Global Awards require an included NASA challenge resource and attribution of actual resources/tools.
- [2025 judging instructional guidance](https://spaceapps-v2-staging.s3.amazonaws.com/media/documents/Final_Space_Apps_2025_Judging_Guidelines_for_web.pdf): historical presentation and meaningful-resource context only; not substituted for current submission rules.
- The existing four local design/React skills informed hierarchy, disclosure, responsive layout and motion. Local Next.js 16.4.6 client-component and static-export guides were read before changes.

## Crew Assist extension sources

Rechecked 15 November 2026: [NASA care §§3.1, 3.5](https://www.nasa.gov/reference/3-0-health-and-medical-care/) for designated medical responsibility and recording encounters/observations; [NASA training §§5.1–5.2.2](https://www.nasa.gov/reference/5-0-training/) for mission-specific medical roles and training verification. The same [HRP Risks](https://www.nasa.gov/hrp/risks/), [Five Hazards](https://www.nasa.gov/hrp/hazards/) and [Standard Measures](https://www.nasa.gov/reference/standard-measures/) provide scope, distance and longitudinal-context boundaries. These are not installed emergency protocols, clinical handoff validation or an endorsement. The fictional drill and handoff layout are participant-requested, AI-assisted software work. No clinical treatment sequence, new dependency or cloud service was used.
