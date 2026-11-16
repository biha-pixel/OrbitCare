# Public-release audit — November 16, 2026

**Status: prepared for owner review; public release is NOT APPROVED.** No unresolved high/critical security or redistribution finding was identified in the reviewed candidate. Publication still requires owner approval of the license, historical metadata disclosures, remaining development advisory and exact release actions. This is a scoped engineering review, not a security/clinical certification or guarantee of zero vulnerabilities.

Repository: [biha-pixel/OrbitCare](https://github.com/biha-pixel/OrbitCare), `main`, initially private and clean at `d81935cad0454ae245402c135c0d9c9108bee022`. [Checkpoint, submission evidence and publication sequence](RELEASE_PLAN.md) distinguish the November 15 candidate from later fixes.

## Findings and disposition

| Severity | Finding | Disposition |
| --- | --- | --- |
| High — reproducibility, fixed locally | Clean Linux-style checkout changed original NASA CSV bytes and made the automated Vercel build fail | `.gitattributes` disables normalization for both source/download copies; original CRLF bytes are staged and checksum-verified. Numerical values/checksum guard unchanged. A fresh Git-produced checkout is part of verification. Remote build not retried. |
| Moderate — development dependency, unresolved | `minimatch` 10.2.6 denial of service via globparts amplification, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). npm reports seven affected package nodes in one TypeScript-ESLint dependency chain | Not part of browser application execution. Full audit: 7 moderate, 0 high/critical; production-only audit: 0 findings. Latest compatible TypeScript-ESLint is 8.72.2 and still requires minimatch `^10.2.2`; advisory's fixed major starts at 11.0.1. A non-forced lock-only fix did not resolve it and its unrelated lock changes were discarded. No untested major override or forced upgrade applied. Avoid feeding attacker-controlled patterns to development tooling; track the upstream compatible fix. |
| Moderate — prototype data boundary | Browser storage, JSON and printed records have no application encryption/authentication or tamper-proof identity/history | Existing explicitly bounded design, documented in SECURITY.md. Use fictional test records; not suitable for private medical records. Source labels/timestamps are unverified input. |
| Low — hardening, fixed locally | Framing/object embedding and unused browser permissions were not explicitly constrained | Preview, Vercel source config and prepared Build Output API config now deny framing/object embedding, constrain base/form targets and disable camera/microphone/location. Existing MIME/referrer protections retained. Full script/style CSP remains future work; no broad XSS-protection claim. |
| Low — privacy | Personal absolute path in narration documentation; two author/committer email identities in Git metadata | Current narration path is repository-relative. Historical path/email metadata remains; no history rewrite. Owner acceptance or an approved separate public-history strategy is required. Upstream template example paths and public third-party copyright contacts are distinct from project private records. |
| Low — license clarity, fixed locally | Imported guidance and bundled fonts/icons/media needed consolidated redistribution notices | THIRD_PARTY_NOTICES.md, 535-entry locked-license inventory, 80 collected original license texts, Vercel declaration and Phosphor notice added. NASA CC0 and composer CC BY were verified at the original sources. Existing license now credits both team members; MIT retained pending final choice. |
| Informational — local-only credential | Dedicated scanner and supplemental JWT pattern found a token in `.vercel/.env.production.local` | Ignored local configuration; absent from tracked source, release snapshot and scanned Git history. Value never printed or added to public reports. No evidence of public exposure was found, so no rotation/history cleanup is prescribed on this evidence alone. Never publish `.vercel` or raw local audit artifacts. |

## Secret and privacy scan coverage

Gitleaks **8.30.1**, obtained from its official GitHub release. Downloaded Windows archive SHA-256 was verified against upstream checksums: `d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e`.

- History scan: all locally available refs and reflogs, **20 commits**; Gitleaks exit 0, no detected secrets. The supplemental object scan examined **497 unique history blobs** and recorded locations only, never matched values.
- Final source-only snapshot scan: Gitleaks exit 0, no detected secrets. Remote heads/tags inspection returned only `main` at the checkpoint and no tags; private visibility remained unchanged. Remote-only pull-request/unreachable objects remain outside coverage.
- Working tree: tracked/untracked release candidates plus local configuration; generated/dependency/cache/artifact folders excluded from the dedicated tree scan. One expected finding occurred only in ignored Vercel environment state. The publishable source snapshot is scanned separately.
- Initial inventory: **289 tracked files**, no tracked sensitive-name matches, no historical `.env`/private-key/credential-dump name matches. The supplemental scan also reviewed three ignored local configuration files without displaying contents.
- `.gitignore` excludes dependency/build outputs, Vercel state, all `.env*`, audit bundles/reports, logs/backups, key containers and local workspace/configuration folders. Required data, fixtures, application assets and media are retained. There is no `.env.example` because no variables/service credentials are required.
- Personal information review covered source/configuration/documentation paths and Git identity metadata. Monitoring fixtures and Crew Assist are fictional; coded OSD-575 observations are separately attributed public research. No private medical/astronaut record was identified in the release source.

Repeat with a locally installed scanner (reports are ignored and must stay private):

```sh
gitleaks git . --log-opts="--all --reflog" --redact=100 --report-format=json --report-path=artifacts/release-audit/gitleaks-history.json
node scripts/audit-public-release.mjs
```

Scan a source-only snapshot with `gitleaks dir PATH_TO_SNAPSHOT --redact=100`; never assume ignored working files are absent from history. The local full-tree scan used a temporary config excluding generated/dependency artifacts, not a repository-wide token allowlist. No new permanent suppression rule hides Vercel credentials in source.

Coverage limitations: heuristic/dedicated scans may miss unknown credential formats; image pixels, PDF/video/audio, arbitrary ignored logs, dependency caches and binary payloads are not exhaustively analyzed for secrets. The supplemental scanner skipped binary blobs. Genuine new screenshots were visually reviewed in an isolated synthetic context. Remote-only PR refs, unreachable/deleted server objects, hosting secrets, organization settings and full remote access history are outside local scanning. Original private audit reports/checkpoint bundles remain ignored.

## Application security review

Reviewed `package.json`/lock, Next.js static-export config, scripts, static public assets, imports/exports, IndexedDB, service worker, curated external links and hosting configurations. No runtime service keys or `NEXT_PUBLIC_*` secrets are required; runtime environment use is limited to the production-mode switch. No API route/development endpoint or backend record ingestion exists.

Untrusted JSON is parsed then validated with strict Zod schemas, explicit version/units, finite ranges, bounded arrays and identities; import size is limited to 2 MiB before file reading and in the library. Incident registry is bounded to 50. Prototype state/import trust limitations are documented. User notes render as React text; no untrusted `dangerouslySetInnerHTML`, DOM HTML sink or dynamic code evaluation was found. External source links are curated and use `rel="noreferrer"`. Static preview is loopback-bound and checks resolved paths stay within `out/`.

Service-worker caches contain public application assets, not IndexedDB records. Readiness checks all manifest assets. Demo media is excluded from precaching. Host protections are prepared locally and have not changed the live deployment. The limited CSP deliberately does not claim comprehensive script/style injection defense.

## Redistribution and attribution

The actual OSD-575 page rendered HTTP 200 and **License: CC0-1.0**. NASA policy links redistribution to its Science Information Policy and requests dataset attribution. Original source/DOI/checksum/provenance remain intact. Scott Buckley's original track page explicitly permits CC BY 4.0 reuse; narration credits identify the composer, source, license and edits. Models/music inputs are not redistributed. Font OFL, Lucide ISC/Feather MIT, skill Apache/MIT and individual dependency obligations are retained separately.

[THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) records exact assets, decisions and limits; [REFERENCES.md](../REFERENCES.md) remains the source bibliography. No blanket NASA-public-domain or automatic third-party relicensing claim is made. Lock declarations include MPL/LGPL tool/native packages; binaries/toolchains are not shipped. A complete binary-distribution legal/SBOM review is outside this source/static release.

## Validation

Test environment: **Node.js 26.8.1, npm 11.19.0, Windows PowerShell, installed Playwright Chromium**. Linux GitHub CI has been prepared but not run on GitHub; no green hosted status is claimed. GitHub’s private-vulnerability-reporting endpoint returned 404 for the current private repository, and security-feature state was unavailable; neither is claimed enabled.

| Command / check | Result |
| --- | --- |
| `npm ci` | Passed; 430 installed packages from existing lockfile, no required environment file |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | **41 passed**, 5 suites |
| `npm run build` | Passed; original 531 source rows / 56 selected observations verified; static export and service worker generated |
| `npm run test:e2e` | **44 passed**, including actual offline reload/persistence, accessibility, media and new host/XSS checks. The same complete 44-test suite also passed against the separately installed/built clean-checkout artifact on a second preview port. |
| `node scripts/prepare-vercel.mjs` | Prepared static artifact locally; no deployment |
| `node scripts/capture-readme.mjs` | Six actual application views plus optional 1280 × 640 social capture; optimized JPEGs, total under 1 MiB |
| Original application preservation | All **65** existing files under `app/`, `components/`, `lib/`, `data/`, `public/` have identical working-byte SHA-256 to the preparation checkpoint |
| NASA Git-byte verification | Staged source/download copies are each 25,275 bytes and match the original SHA-256 |
| Fresh checkout | Passed: temporary Git index with `core.autocrlf=false`, followed by `git checkout-index`; both NASA copies match original bytes. Separate `npm ci` (430 packages) and `npm run build` both passed without environment files or copied dependencies. This simulates Git byte handling on Windows; hosted Linux CI is still unrun. |
| Public app/demo | Fresh unauthenticated requests returned HTTP 200; Vercel existing production is Ready |
| `npm audit --omit=dev --json` | 0 reported production vulnerabilities |
| `npm audit --json` | 7 moderate development-chain findings; no high/critical |

Raw command output, inventories, source/license snapshots, original PNGs and scanner reports live under ignored `artifacts/release-audit/`. Historical QA documents describe earlier runs. No failure has been converted into a claimed pass: initial network-blocked scans were retried successfully; an unsuccessful compatible dependency remediation was discarded; the initial deployment failure was reproduced from Git-byte evidence and addressed without weakening verification.

## Changes prepared

- Professional README and actual screenshots; no app feature/redesign or duplicate MP4.
- SECURITY.md, CONTRIBUTING.md, docs index, setup, architecture, methodology, testing, license decision, release plan and this audit; existing authoritative NASA/limitations/AI documents retained.
- Third-party notices, machine-readable license inventory, original installed license texts, Vercel/Phosphor notices and inactive Apache alternative.
- Expanded ignore rules, `.nvmrc`, pinned read-only GitHub Actions verification workflow.
- CSV Git-byte preservation, static-host security headers and two meaningful browser regression checks.
- Both-team copyright attribution and a repository-relative narration-document path. No package version/lockfile change is retained.

## Final gate

There is **no detected credential in the scanned publishable history**, but current-history publication exposes normal author email metadata and an old username/path. No history cleanup is authorized or performed. After the owner accepts those disclosures and the MIT/alternative license decision, publish only the reviewed branch/commit following [RELEASE_PLAN.md](RELEASE_PLAN.md). Re-scan the final commit before any visibility change. A push to the linked `main` can trigger Vercel; include that in approval. The current private repository, live application and demonstration URLs have been preserved.

<details>
<summary>Exact prepared file list (42 paths)</summary>

- .gitattributes
- .github/workflows/ci.yml
- .gitignore
- .nvmrc
- AI_USE.md
- CONTRIBUTING.md
- LICENSE
- NARRATED_DEMO.md
- NASA_DATA_SOURCES.md
- README.md
- REFERENCES.md
- SECURITY.md
- THIRD_PARTY_NOTICES.md
- data/raw/OSD-575-CMP.csv
- docs/ARCHITECTURE.md
- docs/GETTING_STARTED.md
- docs/LICENSE_DECISION.md
- docs/README.md
- docs/RELEASE_AUDIT.md
- docs/RELEASE_PLAN.md
- docs/SCIENTIFIC_METHODOLOGY.md
- docs/TESTING.md
- docs/images/crew-assist.jpg
- docs/images/decision-replay.jpg
- docs/images/health-explorer.jpg
- docs/images/health-review.jpg
- docs/images/mission-overview.jpg
- docs/images/nasa-research.jpg
- docs/images/social-preview.jpg
- docs/licenses/Apache-2.0.proposed.txt
- docs/licenses/Phosphor-MIT.txt
- docs/licenses/Vercel-SKILLS-MIT.txt
- docs/licenses/dependencies.json
- docs/licenses/npm-NOTICES.txt
- public/research/OSD-575-original.csv
- scripts/audit-public-release.mjs
- scripts/capture-readme.mjs
- scripts/generate-license-notices.mjs
- scripts/prepare-vercel.mjs
- scripts/serve.mjs
- tests/browser/release-security.spec.ts
- vercel.json

</details>
