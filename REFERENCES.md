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

Skills are project-scoped copies in `.agents/skills/`, with licenses and skills-lock.json. They add no runtime service or hooks. Impeccable, UI UX Pro Max, and Anthropic Webapp Testing were reviewed but not installed to avoid redundant tooling/hooks/binaries/testing stacks.

OrbitCare code retains the existing MIT license, copyright Bihandu Liyanage 2026. Third-party sources retain their terms. No NASA branding, endorsement, or certification is claimed.
