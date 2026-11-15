# OrbitCare deployment

## Additive narration-review publication - 15 November 2026

Production **dpl_DXBcBZUvsEUKLZw7pTVeiQTEFvCG** is Ready at https://orbitcare-eight.vercel.app/ (deployment URL https://orbitcare-1t4u7pjx0-nutri-38e1.vercel.app). It adds only four review assets to the existing static application: the narrated MP4, English narration VTT, audio credits and a comparison page. Existing video bytes were reused without regeneration. This publishes a review candidate; **the official demo remains the original silent `/demo/OrbitCare-demo.mp4` until the user approves replacement**.

- [Public narrated MP4](https://orbitcare-eight.vercel.app/demo/OrbitCare-demo-narrated.mp4)
- [Sequential narrated/silent comparison and downloads](https://orbitcare-eight.vercel.app/demo/narrated-review.html)
- [Unchanged official silent MP4](https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4)

Anonymous asset/hash checks, HTTP 206 range access and complete public playback passed: 28.000 seconds, 840 frames, zero dropped/corrupted frames, decoded audio, eight caption cues and no browser page errors. All 56 original artifact payloads are preserved. Before publication, the hosted Turbopack file differed only by Vercel's opt-in toolbar suffix; its application-code prefix matched exactly. After publication all 56 original artifact files match public bytes. The original silent MP4 retains SHA-256 `8f18b1951d0e81b210ddab8540d4fc77212abd78f7cbb16f1407dc92146d6ef8`; the narrated candidate retains `b3acec8a2704efe280f5bc5a6f4263d3350f234821a103f9fb5a26a259db0309`. No app/science changes, source commit/push or judging submission were made. Global Vercel protection settings were not changed. Human listening review remains pending.

Evidence: NARRATED_DEMO.md and `artifacts/narrated-app-publication/`. The prior application release **dpl_TMyUrpL1vHy9Lbxjp4cChWmUe5WF** remains available for rollback. The earlier protected media-only trial **dpl_8sqGWB27baTF4ffLF6BFsDpcMBob** contains no application and must never be promoted onto the official app domain.

Working-tree attribution correction: submission documents now credit Bihandu Liyanage and Nesandu Liyanage collectively, including Crew Assist. The matching `public/demo/index.html` footer correction is local and has not been deployed. The release byte comparisons below describe the published release at verification time.

## Cinematic production release - 15 November 2026 at 20:01 Asia/Colombo

Production **dpl_TMyUrpL1vHy9Lbxjp4cChWmUe5WF** is **Ready** at https://orbitcare-eight.vercel.app/ (deployment URL https://orbitcare-glymu5tpc-nutri-38e1.vercel.app). The participant explicitly approved promotion of verified candidate **dpl_AWZz2FrihrbgtFMTRVqbMiEigqhB**. Protected preview: https://orbitcare-h884wvtaa-nutri-38e1.vercel.app; protection was retained. The previous production **dpl_ivAkd6evSFgFx1ghkmtsHqPpeNfr** remains in deployment history for rollback. No source commit/push or NASA judging submission was made. All release entries below are historical.

The release contains the optional procedural 3D opening, actual five-stage walkthrough, as-of replay milestones, layered body explorer, research introduction and updated submission media. Local build, TypeScript, lint, 41 unit/data tests and all 42 browser tests passed. Public application markers and exact SW, MP4, PDF, poster, player/slide HTML and original NASA CSV bytes match the tested local artifact. Actual public playback and both team credits passed. Edge public offline reopen, local review save, second offline reload and bundled research passed. All 42 public acceptance checks are verified: 41 passed the initial full run; the remaining accessibility check passed on rerun after the audit was made to wait for finite entrance animations. This changed test timing only; production files are unchanged.

Public media: [28-second demonstration](https://orbitcare-eight.vercel.app/demo/), [MP4](https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4), [seven-slide PDF](https://orbitcare-eight.vercel.app/demo/OrbitCare-seven-slides.pdf). Both team names and visible procedural-art disclosure are preserved.

Evidence and all five before/after screenshot sizes: [CINEMATIC_UPGRADE.md](CINEMATIC_UPGRADE.md), `artifacts/cinematic-release/` and `artifacts/cinematic-after/`. Final cache: `efccd56fac9c6a3d`, 51 assets, about 1.65 MiB. Public asset hashes are in `artifacts/cinematic-release/public-verification.json`.

## Previous Crew Assist release — 15 November 2026 at 17:48 Asia/Colombo

Production **dpl_ivAkd6evSFgFx1ghkmtsHqPpeNfr** is Ready at https://orbitcare-eight.vercel.app/ (deployment URL https://orbitcare-kv7e8ui41-nutri-38e1.vercel.app). Final protected preview: **dpl_GJDBcqikDPiSLGtCgBbsUnvcz4XC**, https://orbitcare-t3ktaenj1-nutri-38e1.vercel.app. Preview HTML, MP4, PDF and SW matched the tested local artifact before promotion. The previous verified production **dpl_BrXpy5kcdiZ86cXFZRstmvDMijaV** remains the fallback in deployment history. Source changes remain local and uncommitted; no agent commit/push was made.

**Help a crewmate** opens shared urgent guidance independently of monitoring flags. Optional local incident documentation, a deterministic fictional Mars drill, explicit selected-day historical snapshots, JSON import/export, text download and browser Print / Save as PDF follow. No approved mission-specific protocol, medical detection, triage, treatment, automated contact, cloud service or crew-device sync is implemented. Normal monitoring remains the default. The original logo files are unchanged; distracting movement is paused within Crew Assist/urgent guidance.

Passed: lint, TypeScript, 39 unit/data tests, production build, complete 34-test local browser run and all 34 browser checks on the final public alias. Affected Crew Assist tests passed again after final print/form corrections. Edge public Crew Assist offline reload, previously unvisited drill, export/import, handoff persistence after another reload and ordinary monitoring/research smoke passed. Fresh public asset hashes match local HTML, media, slide HTML, poster, service worker and original NASA CSV.

Core offline manifest: **9ab37165e2fd56ad**, **49 assets**, approximately **1.60 MiB**. MP4: **28.000 seconds**, **1920×1080**, **30 fps**, **840 H.264/yuv420p frames**, **1,336,582 bytes**, SHA-256 `2976c054adc357c1855ea933d7d4ea50871167de62a88095fcfe69d91a2e0f1c`. PDF: **seven native 16:9 slides**, **668,689 bytes**, SHA-256 `dd4888dc29423133f38dffe85672486d56fafda33c2ef68892f4d005b01e0f65`. Only scene 13–16.5 seconds and slide 4 changed in content; the six other PDF pages are pixel-identical. Both team names and the NASA laboratory slide are preserved. The eight-scene transcript matches. Crew captures: **2026-11-15T11:49:22.151Z**; retained monitoring/NASA/offline captures and the corrected review explanation keep their original provenance.

Evidence: `artifacts/crew-baseline/`, `artifacts/crew-final/`, `artifacts/presentation/capture.json` and `encoded-frames/verification.json`. This is a public deployment, not confirmation of judging submission. Earlier release entries below are historical.


## Previous media correction — 15 November 2026, 15:56 Asia/Colombo

Production **dpl_BrXpy5kcdiZ86cXFZRstmvDMijaV** is Ready at https://orbitcare-eight.vercel.app/ (deployment URL https://orbitcare-6y8zgtjma-nutri-38e1.vercel.app). Protected preview **dpl_HofgSbUaYPnuTJSsVU2Y4x3xMCg9**, https://orbitcare-dnnalsynu-nutri-38e1.vercel.app, matched the tested HTML, MP4, PDF and service worker before promotion. The previous verified production **dpl_9JcQtRhUEeVP1cWiFKJRdG2xjwvu** remains in deployment history as fallback. An initial preview upload failed with a transient connection error; retry succeeded before promotion.

The 8–13-second scene now uses a steady capture of the actual synthetic day-24 review explanation, replacing a moving crop that showed a partial navy panel at 12.5–13 seconds. The timed eight-scene transcript and current media/AI descriptions match the final cut. No application, scientific data, test, license or PDF content changed in this pass; 48 protected file hashes match the starting snapshot. Both **Bihandu Liyanage and Nesandu Liyanage**, **Anuradhapura, Sri Lanka**, remain in the public credits and PDF.

Final MP4: **28.000 seconds**, **1920×1080**, **30 fps**, **840 frames**, H.264/yuv420p, **1,308,305 bytes**, SHA-256 `61c4d945a9e6d496aa04c80a84d55aca219a1cbd075cff3bb7be3dedcb31d78d`. All frames decode without error. Public links return HTTP 200 without authentication. PDF: unchanged **seven 16:9 pages**, **736,453 bytes**, SHA-256 `bd0de876c36fe5decdb8becc1ad0bf0cb80f6a4ba35a0e78555a5d6c9140c56c`. Core offline manifest: **c7c1f776eb95213e**. The new explanation was captured at **2026-11-15T10:16:56.955Z**; retained reference/NASA/offline captures are from **2026-11-15T09:11:57.181Z**.

Lint, 31 unit/data tests, production build/TypeScript, six relevant local and six public browser checks passed. Fresh public media/credit/transcript checks and Edge offline/review persistence passed. Evidence: `artifacts/media-final/` and `artifacts/presentation/encoded-frames/`. Source changes remain local and uncommitted. This deployment does not complete the official judging submission.

Earlier release records below are historical.


## Previous team-membership release — 15 November 2026, 15:26 Asia/Colombo

Production **dpl_9JcQtRhUEeVP1cWiFKJRdG2xjwvu** is published at https://orbitcare-eight.vercel.app/. It lists **Bihandu Liyanage and Nesandu Liyanage**, Local Event **Anuradhapura, Sri Lanka**, in the public demo credits and seven-slide presentation. Bihandu confirmed both registrations and approved Nesandu’s membership. See AI_USE.md for the team's collective development attribution and assistance disclosure.

Only the PDF title slide and public demo credits changed in the deployed materials. Slides 2–7 match the previous release pixel for pixel. The existing MP4 contains no outdated membership claim and was **not regenerated**: 28.000 seconds, 1,388,512 bytes, SHA-256 `926a5401e072b077603e8980f96b9254a94c30855e088f18d336d0935172e3eb`. The updated PDF has exactly seven 16:9 pages, 736,453 bytes, SHA-256 `bd0de876c36fe5decdb8becc1ad0bf0cb80f6a4ba35a0e78555a5d6c9140c56c`.

Build/TypeScript, renderer lint, 31 unit/data tests, targeted local demo and judge-journey browser checks passed. Public demo playback/seven-page checks and Edge offline persistence passed. Fresh public browser checks verified both names, the event, preserved original creator attribution and exact local/public HTML, slide HTML, PDF, MP4 and service-worker hashes. Hash checks confirm all 47 protected application/data/test/license/video/poster files are unchanged from the start of this membership update. Core offline cache was rebuilt as `32eb234bb0232bf0`.

Protected preview: dpl_76AMn5ghyfonLYsnR29Cc3GvdX3w, https://orbitcare-jlymrwjo5-nutri-38e1.vercel.app; credits/PDF matched the tested files before promotion. Previous verified production dpl_FF9aFyLmA98toA4uavzPuwDFnqo3 remains the fallback. Evidence: `artifacts/team-update/public-verification.json`, `pdf-verification.json`, `preservation-baseline.json`, `team-slide.png` and public credit screenshots. Earlier release records below remain historical. Source changes remain local and uncommitted; the participant must still complete judging submission.

## Previous judge-first release — 15 November 2026, 14:58 Asia/Colombo

Production deployment **dpl_FF9aFyLmA98toA4uavzPuwDFnqo3** is Ready at **https://orbitcare-eight.vercel.app/**. Deployment URL: https://orbitcare-2kyfxs1ii-nutri-38e1.vercel.app. Protected preview: dpl_7Q6zbnvKXkAGarGJCdXd9pDvKDyp, https://orbitcare-9b7r1uoow-nutri-38e1.vercel.app. The previous verified production dpl_EMS6sxHxe1j6RDLhCCDqaVuqoapc remains in deployment history as fallback. The sections below describe that earlier release and are retained as history.

The original pulse and planet logo files are restored exactly to the starting revision. Normal motion loops continuously; reduced motion disables both. The judge-first brief, progressive investigation, manual decision replay, research-to-feature cards and selected-day explorer integration are live.

The final artifact passed 31 unit/data tests, TypeScript, lint, production build and all 28 local browser checks before promotion. Authenticated preview retrieval verified exact service-worker, MP4 and PDF bytes. All 28 checks then passed against the final public alias in fresh unauthenticated contexts; Microsoft Edge public offline/persistence smoke passed. Public four-size screenshot and logo-motion checks passed. Public SW/video/PDF bytes match the local artifact. No deployment protection was disabled.

Core offline version: **a89a23532d5971c1**, 48 assets, approximately 1.57 MiB. Video: **28.000 seconds**, 1920×1080, 30 fps H.264, **1,388,512 bytes**. PDF: exactly **seven native 16:9 pages**, **736,418 bytes**. Media captures: 2026-11-15T09:11:57.181Z (UTC). Actual encoded scenes and all exported PDF pages were visually inspected. Manual replay and offline review are actual recorded interactions; saved review survives another offline reload.

SHA-256:

- MP4: `926a5401e072b077603e8980f96b9254a94c30855e088f18d336d0935172e3eb`
- PDF: `6155a48342e12fa596c7b7a330164c3941dcc434fea65130d74bc8f7e549040e`
- Service worker: `8e17ddcbb7f911907a3e00858523d3d836adf50f70a6fe1ea72910a9590ab1c4`

Evidence: `artifacts/judge-final/preview-verification.json`, `artifacts/judge-final/public-verification.json`, `artifacts/judge-public/`, and `artifacts/presentation/verification.json`. Final public links remain the application, `/demo/`, `/demo/OrbitCare-demo.mp4`, and `/demo/OrbitCare-seven-slides.pdf` on the stable production domain. No agent commit or push was made. NASA judging submission still requires the participant’s registered account and successful confirmation.

## Public links

- Application / final project: **https://orbitcare-eight.vercel.app/**
- Captioned 28-second 1080p demo page: **https://orbitcare-eight.vercel.app/demo/**
- Direct MP4: **https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4**
- Seven-slide PDF fallback: **https://orbitcare-eight.vercel.app/demo/OrbitCare-seven-slides.pdf**

## Guided-care release - 15 November 2026

Published production: dpl_EMS6sxHxe1j6RDLhCCDqaVuqoapc, deployment-specific URL https://orbitcare-oxmob0w4b-nutri-38e1.vercel.app. Use the stable public production alias above for judges. The previous verified release dpl_7xF44a7wDxZz46LLoUnFr2tTqY6D remains in deployment history as fallback.

Protected preview: https://orbitcare-bj6c4e2bg-nutri-38e1.vercel.app (dpl_8Cn7y1aREcu8bDQg4uUi1jT2Pe7Z). Before production, signed-in CLI retrieval confirmed matching final app HTML apart from Vercel's injected preview feedback script and an exact matching service worker. Unchanged media matched on the preceding preview; final public MP4/PDF checksums also match the verified local files. Protection was retained. The full local suite passed all 23 checks, with affected replay/body and offline tests separately rerun after the last one-line correction. Edge offline smoke also passed. All 23 acceptance checks passed against the final public release in fresh unauthenticated Chromium contexts (2.2 minutes). Microsoft Edge final public offline/persistence smoke passed. Public service-worker/video/PDF bytes match the verified local files.

Core offline version: d9e046d3f93c54aa; 48 assets, approximately 1.55 MiB. The new separately loaded explorer chunk, SVG/code, guides, evidence and urgent signpost are bundled and tested after a real offline reload. Submission media is excluded from core preparation.

Final media: 28.000-second 1920x1080/30-fps H.264 video, 1,236,621 bytes; PDF exactly seven native 16:9 pages, 656,741 bytes. Every actual PDF page and all encoded video scenes were visually inspected. The video uses actual composed application closeups and a recorded disconnected-browser review, not a continuous recording. Persistence was verified after another offline reload.

SHA-256:

- MP4: 10fb596a7a0b25f24a020e90e92928c96d0aa46e1adaf6cdaec1bacd2fc85d86.
- PDF: f903aef8854214519715df8c8ec27080e73619c4169d9bf4d83ba7d42e33274d.
- Service worker: 140cdf0879a18b1f3c3aedbcbf9590a44e17702b0ac98904e0073e684fa7211c.

Preview proof: artifacts/alignment-final/preview-verification.json. Software/source-preservation proof: QA_REPORT.md and artifacts/alignment-final/preservation.json. Deployment is not NASA judging submission.

## Deployment method

The application is a static Next.js export. Build locally, package the same `out/` files using Vercel Build Output API v3, then deploy directly:

```sh
npm run build:deploy
vercel deploy --prebuilt --prod --yes
```

The project is already linked locally through ignored `.vercel/` settings. New checkouts may need `vercel login` and `vercel link --project orbitcare` first. Do not paste credentials into chat or commit `.vercel/` or environment files.

Vercel's automatic build detected a Node26 setting that its local builder rejected. The static artifact is compiled with the tested local Node.js 26.8.1 environment and needs no Node runtime in production. The packaging script intentionally uses the documented static Build Output API instead of a hosting-side application build. It copies public output only; no source, `.git`, private records, or environment credentials are part of the static upload.

The generated service worker receives no-cache headers and prepares approximately 1.55 MiB of core assets. `/demo/` media is intentionally excluded from the offline-preparation requirement: watching submission media requires connectivity or a separately downloaded copy. Core monitoring, evidence, research, review, and portability remain bundled offline.

Production Vercel aliases are stable while deployment-specific preview URLs may have Vercel authentication. Use the public production alias above for judges. Recheck it without owner cookies after every release.

## Source and submission

The implementation agent has made **no commits or pushes**. Source changes remain local for the participant to review and publish manually. Do not submit a repository URL as the finished source until that manual publication is complete.

The agent has no authenticated NASA Space Apps submission dashboard access. The participant must copy the final fields/links, click **Submit for Judging**, and retain successful confirmation before the deadline.
