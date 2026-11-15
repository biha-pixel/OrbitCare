# OrbitCare — release verification

Performed 15 November 2026 in the participant's Windows workspace. Tested environment: Node.js 26.8.1, Next.js 16.4.6, React 19.3.0. These are software checks, not clinical validation or an astronaut usability study.

## Actual completed checks

| Check | Observed result |
|---|---|
| `npm run lint` | Passed, no remaining errors/warnings in the checked source |
| `npm run typecheck` | Passed |
| `npm test` | 28 tests passed across analysis, validation, and research-integrity suites |
| `npm run build` | Passed; static root, not-found and manifest exported; production service worker generated |
| Public Chromium acceptance suite | 12 tests passed against https://orbitcare-eight.vercel.app in fresh unauthenticated contexts |
| Microsoft Edge smoke | Passed: initial analysis, real offline reload, persisted review, bundled research, no page errors |
| Automated accessibility | No axe WCAG 2 A/AA and 2.1 AA violations detected in monitor/research/method/data views and check-in dialog tested |
| Responsive review | 1440px,768px and360px screenshots captured; no horizontal document overflow in the tested workspace |
| Keyboard check | Keyboard opens the check-in dialog; Escape dismisses; visible focus styling present |
| NASA integrity | Exact source checksum/byte length; all 56 selected observations match original CSV; units, four participants, seven visits and unique keys preserved |
| Public media | MP4 metadata/playback tested; duration within30s; fallback PDF response succeeds and contains seven pages |
| Public source snapshot asset | Original NASA CSV served successfully at 25,275 bytes |
| Dependency audit, runtime | `npm audit --omit=dev`: 0 known vulnerabilities at audit time |
| Full dependency audit | 7 moderate findings in development-only TS-ESLint/minimatch dependency chain; no high/critical findings; no forced upgrades applied |
| Credential-pattern source check | 36 application/data/script/test files checked; no matching private-key/GitHub/OpenAI credential patterns found. This is not a comprehensive secret audit. |
| `git diff --check` | Passed; Git emits normal LF/CRLF conversion notices on this Windows checkout |

## Browser coverage in detail

1. Deterministic scenarios, change/review transitions, selected-day replay, no future table observations, and return toward reference.
2. Daily check-in bounds, valid zeros, save/reload persistence, and explicit replacement confirmation.
3. Local review history survives reload without clearing calculated flags.
4. NASA observations and methodological evidence remain separate and inspectable.
5. Actual JSON download, validated import as a new workspace, malformed import rejection, and explicit reset.
6. Empty custom workspace shows reference/insufficiency states rather than a health conclusion.
7. Genuine network disconnection, production reload, local review save/reload, bundled research/method opening, and export.
8. A fresh unprepared offline context cannot load the application.
9. Responsive layouts, main-view automated contrast/accessibility, keyboard dialog, and page-error checks.
10. Day200 remains selectable/visible in plots, intervening missing days do not extend persistence, and print media contains the review record and observations.
11. Automated accessibility of research/method/data/monitor and entry dialog.
12. Public demo metadata/playback, seven-page fallback, and bundled original CSV availability.

Numerical tests include hand-calculated median/MAD, lower ordinal median, reference sufficiency, boundary values, persistence/gaps/non-comparability, and future-data exclusion. Validation tests include malformed/oversized/unsupported imports, units/origin separation, duplicate days/IDs, shifted-reference rejection, and valid zeros/nulls.

## Issues found and resolved

- Static manifest export needed `force-static`; PPR/cache options were disabled together for this installed Next version.
- Windows Controlled folder access blocked headless Chrome downloads inside Documents/test artifacts. Downloads now use a dedicated OS-temporary directory. No Defender exception or disabled protection was needed. The downloaded JSON was successfully re-imported in the browser test.
- Contrast findings in monitoring persistence and method-step labels were corrected and rechecked.
- Plots/timeline previously stopped at 180 despite accepting later mission days. They now show a bounded window around the selected period; the day 200 regression passed.
- Import validation now rejects shifted references and duplicate review IDs instead of accepting data the UI cannot faithfully interpret.
- Demo media is excluded from core precaching, preserving the small offline preparation requirement.

## Scientific review

Monitoring flags derive only from synthetic/user-test records and explicit rules. NASA observations remain a separate model/view. Original units, data gaps, categorical research visits, repeated participants, short mission duration, and provenance are visible. Evidence context is separated from engineering assumptions. No clinical performance, diagnosis, treatment, emergency-prevention, disease-prediction, or flight-certification claims are supported.

## Limits and remaining participant actions

No clinical/astronaut usability evaluation, Firefox/Safari/mobile-device test, screen-reader audit, complete penetration/security review, or Lighthouse/Core Web Vitals benchmark was run. Automated axe success is not full accessibility certification. Physical devices and intermittent real-world networks remain untested. Storage quota/failure messaging is implemented but deliberate quota exhaustion and browser-eviction recovery were not exercised. Multi-tab/multi-device synchronization is unsupported.

The final video is an actual application capture with caption overlays and real browser network disconnection:28.400seconds,2,106,664bytes. The reviewed cut preserves the stable-to-change opening; public playback/duration and the seven-page PDF were retested successfully after its final upload. The participant should still watch the final video and review all submission text. Deployment details are in DEPLOYMENT.md.

The 2026 official guide PDF, current award definitions/eligibility, and any earlier local judging cutoff remain independently unverified by the agent. Reconcile participant-supplied rules with the registered dashboard. The participant must manually publish source if desired, complete the official fields, click **Submit for Judging**, and retain successful confirmation. No git commit/push or judging submission has been performed by the agent.
