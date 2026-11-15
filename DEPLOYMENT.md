# OrbitCare deployment

## Public links

- Application / final project: **https://orbitcare-eight.vercel.app/**
- Captioned 28.4-second demo page: **https://orbitcare-eight.vercel.app/demo/**
- Direct MP4: **https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4**
- Seven-slide PDF fallback: **https://orbitcare-eight.vercel.app/demo/OrbitCare-seven-slides.pdf**

Application production access and media playback have been tested in fresh, unauthenticated browser contexts. The production acceptance suite passed all 12 checks. The final reviewed video cut is 28.400 seconds, 2,106,664 bytes, with actual stable/change/offline screen capture and baked-in English captions. The fallback PDF has seven pages. Do not mark judging submission complete from deployment alone.

Final release deployment: `dpl_9yGkUZYGP32jVT9uJDp9QSwrYHYC`, ready on 15 November 2026. The deployment-specific URL is https://orbitcare-7kkjr960o-nutri-38e1.vercel.app; use the public production alias above for judges. Core offline asset version: `9d1efa8744a95a27`, 46 cached assets, approximately 1.43 MiB; submission media remains outside this preparation requirement.

## Deployment method

The application is a static Next.js export. Build locally, package the same `out/` files using Vercel Build Output API v3, then deploy directly:

```sh
npm run build:deploy
vercel deploy --prebuilt --prod --yes
```

The project is already linked locally through ignored `.vercel/` settings. New checkouts may need `vercel login` and `vercel link --project orbitcare` first. Do not paste credentials into chat or commit `.vercel/` or environment files.

Vercel's automatic build detected a Node26 setting that its local builder rejected. The static artifact is compiled with the tested local Node.js 26.8.1 environment and needs no Node runtime in production. The packaging script intentionally uses the documented static Build Output API instead of a hosting-side application build. It copies public output only; no source, `.git`, private records, or environment credentials are part of the static upload.

The generated service worker receives no-cache headers and prepares approximately 1.43 MiB of core assets. `/demo/` media is intentionally excluded from the offline-preparation requirement: watching submission media requires connectivity or a separately downloaded copy. Core monitoring, evidence, research, review, and portability remain bundled offline.

Production Vercel aliases are stable while deployment-specific preview URLs may have Vercel authentication. Use the public production alias above for judges. Recheck it without owner cookies after every release.

## Source and submission

The implementation agent has made **no commits or pushes**. Source changes remain local for the participant to review and publish manually. Do not submit a repository URL as the finished source until that manual publication is complete.

The agent has no authenticated NASA Space Apps submission dashboard access. The participant must copy the final fields/links, click **Submit for Judging**, and retain successful confirmation before the deadline.
