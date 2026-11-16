# Testing and reproducibility

Release preparation results, including failures and reruns, are recorded in [RELEASE_AUDIT.md](RELEASE_AUDIT.md). Historical counts elsewhere describe earlier artifacts; they are not current CI badges.

## Required checks

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The first installation requires the registry; Chromium is a separate download. On Linux use `npx playwright install --with-deps chromium`. Production tests use static `out/`, not `next dev`. Playwright starts `scripts/serve.mjs` on port 3000; stop unrelated servers or set `PLAYWRIGHT_BASE_URL` to a controlled matching artifact. Unit tests use Vitest. Axe checks accessibility in browser journeys; automated checks are not a complete accessibility evaluation.

`npm run typecheck` runs `next typegen` before TypeScript, so it works before any development server or production build on a fresh checkout. Next.js generates `LayoutProps` and related route helpers under ignored `.next/` files; do not commit those generated files or rely on a previous build to provide them. CI pins Ubuntu 24.04 and immutable v6 action revisions using the Node.js 24 action runtime; the application tooling still uses Node.js 26.8.1 from `.nvmrc`.

## Coverage

| Suite | Exercises |
| --- | --- |
| `tests/analysis.test.ts` | Medians, spread, reference sufficiency, rule boundaries, missingness and calendar persistence |
| `tests/validation.test.ts` | Portability, finite bounds, schema/version/identity constraints and invalid input rejection |
| `tests/research.test.ts` | Original checksum and exact transformed NASA observations/units/visits |
| `tests/replay.test.ts` | Milestone visibility and selected-day information boundaries |
| `tests/crew-incident.test.ts` | Bounded incident records, fictional drill, snapshots, import/export and handoff labels |
| `tests/browser/` | Monitoring, edits, review persistence, portability, print, urgent signposting, Crew Assist, real offline reload, guided mission, WebGL fallback, keyboard/mobile and axe journeys |

The offline journeys wait for **Offline ready**, use `context.setOffline(true)`, reload, exercise local records and reload again. A persistence-only check or screenshot does not establish offline reopening. These tests verify software behavior, not operational network conditions, medical outcomes or usability with astronauts.

## Additional release checks

`npm run data:prepare` must preserve the original source and selected values. `node scripts/audit-public-release.mjs` writes a redacted inventory and supplemental pattern-scan report under ignored `artifacts/release-audit/`. Run dedicated Gitleaks scans as described in the audit too; heuristic patterns alone are insufficient.

`node scripts/capture-readme.mjs` captures six real local application views to `docs/images/`. It uses a fresh fictional browser context and requires the production preview. Optimized JPEG files are documentation artifacts; the PNG originals and a capture manifest stay under ignored audit artifacts. Rerun only when screenshots need updating.

The proposed GitHub Actions workflow uses read-only repository permission, a pinned Node version and pinned actions. It runs install, lint, TypeScript, unit tests, build and Chromium workflows. It has no deployment step, secrets, write permissions or `pull_request_target` trigger. It has been prepared locally; no hosted CI success is claimed before it runs.
