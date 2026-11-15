# OrbitCare

Understand a sustained change. Inspect the reasoning. Keep monitoring offline.

OrbitCare is an astronaut self-monitoring research prototype for NASA Space Apps 2026, created by Bihandu Liyanage through an AI-assisted discovery and implementation process. It is not a diagnostic, treatment, emergency-triage, or flight-certified system. No NASA endorsement is implied.

## Try the workflow

Verified public links are recorded in [DEPLOYMENT.md](DEPLOYMENT.md). No registration or credentials are required.

1. Compare **Stable**, **Sustained change**, **Missing data**, and **Return to reference**.
2. Select a mission day and indicator. Inspect the personal comparison, persistence, rule, evidence, origin, and uncertainty.
3. Record a review action. It stays local, does not contact support, and does not clear calculated flags.
4. Wait for **Offline ready**, disconnect, and reload. Use monitoring, check-ins, evidence, research, reviews, and export offline.
5. Open **NASA research** for a separate, descriptive view of real OSD-575 serum measurements.

Monitoring data is synthetic or user-entered test data. NASA laboratory observations never enter the monitoring engine. Do not enter private medical information.

## Getting started

Use Node.js 26.8.1 (the tested version) and npm. No environment variables or service keys are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Development does not register the service worker. For the real offline application:

```sh
npm run build
npm start
```

Open http://127.0.0.1:3000. The production preview serves static `out/` files. Use HTTPS or localhost, not a directly opened HTML file.

## Project structure

```text
app/                Routes, layouts, global styles, and app icons
components/         Mission workspace, explanations, check-in, research, data views
lib/                Pure analysis, validation, IndexedDB, offline state
data/               Deterministic scenarios, evidence, original NASA data/provenance
scripts/            Data preparation, service worker generation, static preview
tests/              Numerical, validation, source-integrity, browser tests
public/             Static assets
next.config.ts      Next.js configuration
eslint.config.mjs   ESLint configuration
tsconfig.json       TypeScript configuration and @/* import alias
package.json        Dependencies and scripts
package-lock.json   Locked dependency versions
```

`node_modules/` and `.next/` are generated locally and ignored by Git.

## Commands

- `npm run dev` starts the development server.
- `npm run lint` checks the code with ESLint.
- `npm run build` creates a production build.
- `npm start` serves the production build after `npm run build`.
- `npm run typecheck` checks TypeScript.
- `npm test` runs numerical, validation, and source-integrity tests.
- `npx playwright install chromium` installs the browser for local tests.
- `npm run test:e2e` tests the production artifact, including actual offline reopening.
- `npm run data:prepare` reproduces the selected research subset without network access.
- `npm run data:fetch` explicitly re-downloads the original source, rejecting unexpected checksums.

## Implemented features

Daily heart-rate, sleep, ordinal fatigue, and contextual exercise entries; fixed personal reference statistics; transparent three-day persistence; aligned original-unit plots; mission timeline/replay; evidence and assumptions; review history; native IndexedDB; validated JSON import/export; deliberate reset; printable record; responsive keyboard-accessible UI; production offline PWA; and a separate 56-observation NASA OSD-575 explorer.

Next.js 16.4.6 static export, React 19.3.0, TypeScript, Tailwind 4.3.3, Recharts, Zod, Lucide, and locally bundled IBM Plex fonts. No server, authentication, analytics SDK, cloud model, sensor connection, or automatic synchronization is used. Hosting receives normal web requests; monitoring entries are processed locally.

## Documentation and limitations

See [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md), [NASA_DATA_SOURCES.md](NASA_DATA_SOURCES.md), [SCIENTIFIC_LIMITATIONS.md](SCIENTIFIC_LIMITATIONS.md), [AI_USE.md](AI_USE.md), [REFERENCES.md](REFERENCES.md), [QA_REPORT.md](QA_REPORT.md), [DEMO_SCRIPT.md](DEMO_SCRIPT.md), and [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md). The approved direction is preserved in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), [PRODUCT.md](PRODUCT.md), and [DESIGN.md](DESIGN.md).

Thresholds are prototype engineering assumptions, not NASA medical recommendations. Clinical accuracy, flight suitability, and diagnostic performance are unvalidated. Four short-mission research participants cannot validate long-duration monitoring rules.

Browser records are not encrypted by OrbitCare and can be lost through storage clearing or eviction. Export test records you want to retain. Use one editing tab; multi-tab/multi-device synchronization is not implemented. First-ever offline visits cannot load an unprepared app. External source pages require internet. Browser connectivity is a hint, not proof of Earth communications.

## License

Application code retains the repository's MIT [license](LICENSE). Research material, software dependencies, fonts, and skills retain their own terms; see REFERENCES.md. The implementation agent has not committed or pushed changes.
