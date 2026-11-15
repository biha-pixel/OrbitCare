# OrbitCare deployment

## Public links

- Application / final project: **https://orbitcare-eight.vercel.app/**
- Captioned 28-second 1080p demo page: **https://orbitcare-eight.vercel.app/demo/**
- Direct MP4: **https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4**
- Seven-slide PDF fallback: **https://orbitcare-eight.vercel.app/demo/OrbitCare-seven-slides.pdf**

The redesigned application and media were tested in fresh, unauthenticated browser contexts. All **15 public acceptance checks passed** after deployment, including real offline reopening, persistence, check-ins, replay, import/export, accessibility checks and public media. The final video is **28.000 seconds, 1920×1080, 30 fps, 1,172,296 bytes**, composed from actual app closeups and a recorded offline interaction with baked-in English captions. The PDF has exactly **seven native 16:9 pages**. Every exported PDF page and encoded video scenes were visually inspected. Deployment is not judging submission.

Redesigned release: `dpl_7xF44a7wDxZz46LLoUnFr2tTqY6D`, ready on 15 November 2026. Deployment-specific URL: https://orbitcare-dhaj41qpj-nutri-38e1.vercel.app. Use the public production alias above for judges. Core offline version: `d2cee106b7588479`, 46 assets, approximately **1.50 MiB**; submission media remains outside core preparation.

The same static artifact was first uploaded to preview https://orbitcare-8gi484czd-nutri-38e1.vercel.app (`dpl_3z1P5dVVpumQGRb3DekSEJQpfk8c`). Signed-in CLI retrieval confirmed identical application HTML before Vercel's injected preview-feedback script, and byte-identical video/PDF. Preview protection was retained. The production command was issued before that checksum comparison finished; the subsequent inspection confirmed only the expected hosting script, and all public regressions passed. Previous release `dpl_9yGkUZYGP32jVT9uJDp9QSwrYHYC` remains available in deployment history as the fallback.

Final media SHA-256:

- MP4: `15f81749ddd1fc05b049ac2c2bf20d323907353e7dc726b55c356ffbddde2645`.
- PDF: `1878142393b88f2a3dc82713c5b84671042d9bb4f3a4db16979516a721cb36fb`.

## Deployment method

The application is a static Next.js export. Build locally, package the same `out/` files using Vercel Build Output API v3, then deploy directly:

```sh
npm run build:deploy
vercel deploy --prebuilt --prod --yes
```

The project is already linked locally through ignored `.vercel/` settings. New checkouts may need `vercel login` and `vercel link --project orbitcare` first. Do not paste credentials into chat or commit `.vercel/` or environment files.

Vercel's automatic build detected a Node26 setting that its local builder rejected. The static artifact is compiled with the tested local Node.js 26.8.1 environment and needs no Node runtime in production. The packaging script intentionally uses the documented static Build Output API instead of a hosting-side application build. It copies public output only; no source, `.git`, private records, or environment credentials are part of the static upload.

The generated service worker receives no-cache headers and prepares approximately 1.50 MiB of core assets. `/demo/` media is intentionally excluded from the offline-preparation requirement: watching submission media requires connectivity or a separately downloaded copy. Core monitoring, evidence, research, review, and portability remain bundled offline.

Production Vercel aliases are stable while deployment-specific preview URLs may have Vercel authentication. Use the public production alias above for judges. Recheck it without owner cookies after every release.

## Source and submission

The implementation agent has made **no commits or pushes**. Source changes remain local for the participant to review and publish manually. Do not submit a repository URL as the finished source until that manual publication is complete.

The agent has no authenticated NASA Space Apps submission dashboard access. The participant must copy the final fields/links, click **Submit for Judging**, and retain successful confirmation before the deadline.
