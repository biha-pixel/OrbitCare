# OrbitCare deployment

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
