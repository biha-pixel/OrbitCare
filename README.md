# OrbitCare

OrbitCare uses Next.js App Router, React, TypeScript, and Tailwind CSS.
The repository root is also the application root; run all commands here.

## Getting started

```bash
npm ci
npm run dev
```

Open http://localhost:3000 to view the app. Edit `app/page.tsx` to update
the home page.

## Project structure

```text
app/                Routes, layouts, global styles, and app icons
public/             Static assets
next.config.ts      Next.js configuration
eslint.config.mjs   ESLint configuration
tsconfig.json       TypeScript configuration and @/* import alias
package.json        Dependencies and scripts
package-lock.json   Locked dependency versions
```

`node_modules/` and `.next/` are generated locally and ignored by Git.

## Commands

- `npm run dev` starts the development server.
- `npm run lint` checks the code with ESLint.
- `npm run build` creates a production build.
- `npm start` serves the production build after `npm run build`.
