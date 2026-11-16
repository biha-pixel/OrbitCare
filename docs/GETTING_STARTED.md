# Getting started

Use Node.js **26.8.1** (also in `.nvmrc`) and npm **11.19.0**, the versions tested for release preparation. A modern browser with IndexedDB is required; WebGL is optional because the mission scene has a static fallback. No account, API key, `.env` file, medical hardware or runtime NASA request is required.

```sh
git clone https://github.com/biha-pixel/OrbitCare.git
cd OrbitCare
npm ci
npm run dev
```

The repository remains private until the owner approves publication; cloning currently requires authorized GitHub access. Visit <http://localhost:3000>. Dependencies must be downloaded on the first install. Development mode does not register the production service worker.

## Production and real offline use

```sh
npm run build
npm start
```

Visit <http://127.0.0.1:3000>. `npm start` serves only the static `out/` directory and binds to loopback. `PORT` can override the preview port. Do not open `out/index.html` directly from the filesystem.

Wait for **Offline ready**, disconnect the browser from the network, then reload. Inspect research, record a fictional check-in/review and export it. A second offline reload checks persistence. First-ever offline visits, uncached demonstration media and external research pages need connectivity. Use localhost or HTTPS; service workers are unavailable in many insecure contexts. Browser storage clearing/eviction can erase records; exports are plaintext.

## Reproduce the NASA subset

```sh
npm run data:prepare
npm test -- tests/research.test.ts
```

The checked-in original CSV is sufficient; build and preparation do not fetch NASA. `npm run data:fetch` is an explicit optional network refresh and rejects unexpected bytes. See [NASA_DATA_SOURCES.md](../NASA_DATA_SOURCES.md) for the original checksum and [methodology](SCIENTIFIC_METHODOLOGY.md) for synthetic monitoring rules.

## Tests and media

Follow [TESTING.md](TESTING.md). Install the separate Chromium download with `npx playwright install chromium`; Linux CI uses `--with-deps`. Browser tests require a completed production build and start their own local preview unless `PLAYWRIGHT_BASE_URL` points to an already-running test server.

The existing [hosted demonstration](https://orbitcare-eight.vercel.app/demo/) is sufficient to inspect the project. Application builds do not need FFmpeg, Python, a speech model or original audio sources. Optional media regeneration needs FFmpeg/FFprobe and Chromium; the narrated candidate also needs the separately downloaded models/music and Python dependencies documented in [NARRATED_DEMO.md](../NARRATED_DEMO.md). Those ignored source/intermediate files are not included in a clean clone; do not claim narration can be regenerated with `npm ci` alone.

## Hosting

`npm run build:deploy` prepares `.vercel/output/` using the static Build Output API. It does not publish. Ordinary static hosting can serve `out/`, but must reproduce the security and service-worker headers in `vercel.json`. Preserve root paths: subdirectory hosting is not configured. Deployment and visibility changes need separate owner approval; [DEPLOYMENT.md](../DEPLOYMENT.md) is historical evidence, not a current deployment instruction to execute automatically.
