# Contributing to OrbitCare

Start with [local setup](docs/GETTING_STARTED.md), [architecture](docs/ARCHITECTURE.md) and [scientific limitations](SCIENTIFIC_LIMITATIONS.md). Discuss a substantial change in an issue before implementing it. Use fictional data in every issue, screenshot, fixture and pull request; report security problems through [SECURITY.md](SECURITY.md).

Keep changes focused. Preserve the separation of synthetic monitoring and original NASA research, selected-day replay boundaries, explicit uncertainty, accessibility and genuinely prepared offline reopening. A local review or export must never imply a transmitted message, resolved alert or medical outcome. Clinical rules require explicit scientific review and updated methodology, not only passing tests.

Before proposing a change:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Explain the problem, resulting behavior, relevant checks and limitations in the pull request. Add meaningful regression coverage for changed analysis, data handling or workflows. Keep generated caches, private data, credentials and raw browser traces out of source control. Retain the original NASA checksum and provenance; a source refresh requires a separately reviewed change. See [testing](docs/TESTING.md).

Use respectful, evidence-based discussion. Describe uncertainty plainly, credit sources and disclose material AI assistance. Human contributors remain responsible for reviewing generated work. Do not claim clinical validation, NASA endorsement or unverified award status.

Original contributions currently use the repository's [MIT license](LICENSE). Third-party content retains its separate terms in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Any proposed relicensing is subject to the rights holders' explicit approval; no contributor agreement or blanket transfer of copyright is implied.
