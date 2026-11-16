# Security policy

OrbitCare is a research prototype for synthetic and fictional test records. It is not a secure production medical record, diagnostic device, emergency service, or clinically certified system.

## Report a vulnerability privately

Use [GitHub's private vulnerability reporting](https://github.com/biha-pixel/OrbitCare/security/advisories/new) if the repository offers it. Maintainers must enable this before publication; this document does not claim it is enabled. If unavailable, contact the repository owner privately through a contact channel they provide and request a secure reporting route. Do not open a public issue with credentials, private records, exploit payloads or unredacted logs. No dedicated security email or response SLA is currently established.

Give the affected revision, a minimal reproduction using fictional data, expected/actual behavior and impact. Redact credentials and personal information. Do not test against other people's records, bypass hosting access controls or disrupt the public demo.

## Data and trust boundaries

- Monitoring and Crew Assist records live in same-origin IndexedDB. No application backend receives them; the hosting provider still handles normal asset requests and may retain request logs.
- There is no authentication, application-level record encryption, device synchronization or tamper-proof audit trail. Anyone with access to the browser profile or same-origin script execution may read or alter local records. Exports and printed handoffs are plaintext.
- Imports are untrusted: strict Zod schemas, 2 MiB limits, finite ranges, array bounds, unique identities and version checks constrain them. Source labels and timestamps are user claims, not verified identity or clinical evidence.
- User text is rendered through React text nodes, not executable HTML. External links are curated sources with `rel="noreferrer"`.
- The generated service worker caches same-origin application assets, not IndexedDB records. Readiness requires all manifest assets to be present. An unprepared first visit cannot open offline; demo media is excluded from precaching.
- Preview and prepared hosting configuration deny framing and object embedding, restrict form targets/base URLs, disable unused camera/microphone/location permissions, and set MIME/referrer protections. This is a limited CSP; script/style source restrictions remain future hardening. Static export cannot use a per-request nonce without changing architecture.

## Supported scope

Security fixes target the current maintained source revision. Historical judging snapshots are evidence, not independently maintained versions. Report coverage and remaining risks are in [the release audit](docs/RELEASE_AUDIT.md). Dependency advisories and scanner results are time-specific and are not proof of absolute security.

Never commit environment files, Vercel state, credentials, browser profiles, exported personal records, local audit bundles or raw audit reports. If a credential was committed, revoke/rotate it first, assess every reachable history copy, and agree a cleanup plan before publication. Removing a current file or adding an ignore rule does not remove history.
