import { access } from 'node:fs/promises';
try { await access('artifacts/presentation/capture.json'); } catch { await import('./capture-presentation.mjs'); }
await import('./render-presentation.mjs');
