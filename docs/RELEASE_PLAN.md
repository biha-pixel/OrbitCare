# Public release plan — awaiting owner approval

Prepared **November 16, 2026**, after the team's reported November 15 judging submission. No publication, source push, history rewrite, branch deletion or live deployment was performed during preparation.

## Repository and checkpoint

- Repository: **biha-pixel/OrbitCare**, <https://github.com/biha-pixel/OrbitCare>.
- Remote: `https://github.com/biha-pixel/OrbitCare.git`.
- Branch/default: `main`; initial working tree was clean and local HEAD matched `origin/main`.
- Checkpoint: **`d81935cad0454ae245402c135c0d9c9108bee022`**, November 15, 2026 at 22:34:50 Asia/Colombo, “Add narrated candidate for OrbitCare demo and related assets.” Verified to exist on GitHub.
- A verified, complete local `git bundle --all` is retained at ignored `artifacts/release-audit/preparation-checkpoint.bundle`. It preserves local refs and the original history; do not publish that private recovery bundle.
- GitHub reported **PRIVATE** during this audit. The final source remains uncommitted. Only `.gitattributes` and the two original CSVs were staged to verify the exact Git bytes; other preparation changes are available for review in the working tree.

## What is known about the submitted revision

The team reports successful submission on November 15. `d81935c` is the latest available source commit from that date, including the narrated review candidate. The earlier `a28b2ae` records collective team attribution. Historical [deployment records](../DEPLOYMENT.md) identify application/media releases, but several explicitly state that deployment was not confirmation of judging submission. The repository contains no authoritative timestamped judging receipt mapping the exact submitted artifact to a commit.

Preserve `d81935c` as the **preparation baseline / November 15 source candidate**, not as a proven exact judging revision. If the owners supply a submission receipt or immutable artifact mapping, record it before calling a tag “submitted.” Never backdate the later release work or imply the screenshots/security fixes existed at submission time. The original bundle and unchanged commits preserve the available evidence.

## Failed automatic deployment email

The November 16 failure for commit `d81935c` was inspected read-only. The build rejected the NASA source checksum before Next.js compilation. Git stored the CSV using LF while the downloaded original and local Windows checkout used CRLF. The Git blob was 24,744 bytes with SHA-256 `891f9ef58ec88b99d09a58c3bb90ec501240ce6ff0408797e713c4fc3c967c91`; original bytes are 25,275 bytes with SHA-256 `dab247eb794edab59aaaa683c85fd1f2dbf4ae3684872739338e10ead4192a0c`.

The prepared fix marks both original CSV paths `-text` in `.gitattributes` and restages the exact original bytes. The checksum guard and numerical data remain unchanged. It must be committed along with both CSVs; adding the attribute alone cannot fix an already normalized Git blob. A fresh Git checkout with conversion disabled verifies the corrected bytes. Hosted deployment is not yet retried.

The existing production deployment `dpl_DXBcBZUvsEUKLZw7pTVeiQTEFvCG` remained **Ready** and the app/demo both returned HTTP 200. A failed newer build did not replace it. This was a reproducibility issue, not evidence of credential theft or altered NASA observations. Keep the current production deployment while reviewing this change.

## Presentation prepared for review

| Setting | Proposed value |
| --- | --- |
| Description | Explainable astronaut self-monitoring, selected-day replay and local Crew Assist, with prepared offline access and separate NASA research. |
| Homepage | `https://orbitcare-eight.vercel.app/` |
| Topics | `nasa-space-apps`, `space-apps-2026`, `astronaut-health`, `research-prototype`, `offline-first`, `pwa`, `typescript`, `nextjs`, `open-science`, `data-provenance` |
| Social preview | [Actual application capture, 1280 × 640](images/social-preview.jpg); no invented status/award badge |
| Source license | Retain MIT, crediting both team members; [Apache alternative](LICENSE_DECISION.md) requires explicit authorization |
| Baseline tag | Proposed `pre-release-2026-11-15` at `d81935c`, accurately labeled as a source candidate |
| First public release tag | Proposed `v0.1.0` on the later reviewed release commit; include research-prototype and post-submission-change boundaries |

No settings or tags were applied. Keep `main` as the default branch; a preparation branch/PR may be used for review after approval. Do not use `git push --mirror`, `--all` or `--force`; local agent refs and recovery artifacts do not belong in the public release.

## Publication sequence after explicit approval

1. Owners approve the final license choice, notices, retained historical author emails/old username path, and acceptable documented moderate development-only advisory. Resolve any new high/critical finding before proceeding.
2. Review/stage only the listed release files. Ensure `.gitattributes` and both CSVs are included with the verified original checksum. Commit with the real current date and an accurate post-submission message. Scan the resulting commit and refresh audit results if contents change.
3. Push only the intended preparation/default branch to the existing **private** remote. **The linked Vercel Git integration may automatically attempt a production build on `main`**; source-push approval must account for that effect. Verify a protected preview or use the established static-artifact flow before an explicitly authorized promotion if avoiding automatic production is desired. Do not alter hosting settings/protection without approval.
4. Verify the hosted build, app/demo links, NASA bytes, headers and offline workflow. Preserve the previous working deployment as rollback evidence.
5. Confirm owner approval for **making this exact existing repository and its history public**. Enable GitHub private vulnerability reporting, secret scanning/push protection and appropriate branch protections where available. These account settings were not modified during preparation; do not claim them as enabled.
6. Change visibility only then, apply approved description/topics/social preview and create accurately described release tags. Confirm anonymous repository access and repeat critical links after the transition.

The reviewed history has no detected credentials. It still contains normal author email metadata and an earlier local username/path. Those low-severity disclosures do not disappear when the current document is cleaned. Existing-history publication is recommended only if the owners accept those disclosures. Otherwise, prepare a separate clean-history public repository after authorization while preserving this private history and candidate mapping; do not rewrite the existing remote automatically.

The [audit](RELEASE_AUDIT.md) is the publication gate. Approval is requested only for the concrete prepared result and stated external effects, not for a hypothetical future implementation.
