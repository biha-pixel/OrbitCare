# Third-party notices

OrbitCare's [MIT license](LICENSE) covers original code/documentation only. Third-party material keeps its copyright, attribution and license. Reviewed **November 16, 2026**; no NASA endorsement is implied.

## Research data and references

`data/raw/OSD-575-CMP.csv`, `public/research/OSD-575-original.csv`, and the selected observations/provenance derive from NASA OSDR [OSD-575](https://osdr.nasa.gov/bio/repo/data/studies/OSD-575), DOI [10.26030/mc5d-p710](https://doi.org/10.26030/mc5d-p710). The rendered study page explicitly lists **CC0-1.0**, verified during this audit; the metadata API omits that field. Preserve [CC0 terms](https://creativecommons.org/publicdomain/zero/1.0/), [OSDR redistribution/citation policy](https://science.nasa.gov/reference/osdr-help-terms-and-conditions/), attribution, DOI, acquisition record, filename, checksum and transformation. Do not infer identities. Use the study citation panel for publication-specific bibliographic exports.

The original CSV has 531 result rows; the validated subset has 56 sodium/potassium observations from four coded people across seven visits. No controlled assay or private source file is added. These public human research observations remain separate from synthetic monitoring and do not validate its rules. [NASA_DATA_SOURCES.md](NASA_DATA_SOURCES.md) records exact source and limits.

NASA, AHA and NHLBI material appears as short attributed paraphrases/links. Public availability is not a blanket copyright waiver. Original pages, figures and treatment protocols are not bundled. [REFERENCES.md](REFERENCES.md) lists sources. No NASA insignia, stock astronaut photograph or downloaded anatomical illustration is part of the application.

## Graphics and media

| Material | Origin / terms | Distribution obligations |
| --- | --- | --- |
| Mark, human schematic, procedural scene and original SVG/CSS/GLSL | Original AI-assisted application code, project MIT | Keep procedural-art disclosure; no geographic, telemetry or medical interpretation. No downloaded model/texture or raster generator. |
| `docs/images/*.jpg`, poster, silent MP4, original slides/PDF | Actual synthetic app captures and edited presentation | Original composition follows project terms; fonts/icons retain theirs. README screenshots are post-submission. Existing videos are retained, not duplicated. |
| Music in `public/demo/OrbitCare-demo-narrated.mp4` | **“Decoherence” by Scott Buckley — released under CC BY 4.0. www.scottbuckley.com.au.** [Source/permission](https://www.scottbuckley.com.au/library/decoherence/), [license](https://creativecommons.org/licenses/by/4.0/) | 00:12–00:40 excerpt; equalization, fades, level adjustment and speech-driven ducking. Keep creator, source, license link and change notice, including in YouTube descriptions. No standalone track distributed. |
| Generated speech in the separate candidate | [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), v1.0 stock `af_heart`, model declared Apache-2.0; [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx), MIT | Disclosed synthetic speech, not a real speaker. Model/tool licenses do not establish a separate exclusive copyright claim over output. Models/voice binaries are not bundled. |

Keep [full audio credits](public/demo/OrbitCare-audio-credits.txt), VTT and descriptive notices with the narrated file. The composer explicitly permits reuse with attribution; this does not settle all Space Apps declarations for a replacement submission. The official silent demo remains unchanged. Optional music/model sources stay ignored; human listening approval of the candidate is pending.

Unused Next.js/Vercel starter SVGs originate with the Next.js scaffold; retain [Next.js MIT notices](docs/licenses/npm-NOTICES.txt). Logo/trademark rights remain distinct. They are not proposed OrbitCare branding or NASA endorsement.

## Fonts, icons and packages

| Material | Terms |
| --- | --- |
| IBM Plex Sans / Mono via Fontsource 5.3.0 | **SIL OFL-1.1**, IBM copyright and reserved-font-name provisions in [npm-NOTICES.txt](docs/licenses/npm-NOTICES.txt). [IBM Plex](https://github.com/IBM/plex). Unmodified; no standalone sale proposed. |
| Lucide React 1.73.0 | **ISC**, plus **MIT** for Feather-derived icons listed in its LICENSE. Both grants retained in [npm-NOTICES.txt](docs/licenses/npm-NOTICES.txt). [Lucide](https://github.com/lucide-icons/lucide). |
| Next.js, React/DOM, Recharts, Zod and transitive packages | Individual MIT/ISC/BSD and other declarations in [dependencies.json](docs/licenses/dependencies.json). |
| Tailwind, Vitest/Vite, TypeScript/ESLint, Playwright, axe and tools | Individual MIT, Apache-2.0, MPL-2.0 and other terms. Tool presence is not runtime integration. |
| Optional Sharp/libvips native packages | Apache-2.0 / LGPL-3.0-or-later and combined declarations. Native binaries and `node_modules` are not shipped in the source/static export. Toolchain/container redistribution requires separate notice/source/relinking review. |

All **535 lock entries** declare a license. This is not a legal opinion or byte-level bundle SBOM. [npm-NOTICES.txt](docs/licenses/npm-NOTICES.txt) preserves installed production/direct-development-tool license texts. Optional packages for other systems require their notices if separately redistributed. Next.js also has compiled-component notices; preserve them when distributing its toolchain. This release packages neither installed dependencies nor a Node runtime.

## Imported agent guidance

Development guidance is not a runtime service or medical evidence. Retain provenance and separate terms.

| Vendored material | Provenance / license |
| --- | --- |
| Frontend Design | [Anthropic skills](https://github.com/anthropics/skills), revision `1780c5e5a552fd4d1c9d6a7b0cab26b0c2bef064` in `skills-lock.json`; **Apache-2.0**, original `.agents/skills/frontend-design/LICENSE.txt` retained. No NOTICE was present in the copied directory. |
| Vercel React Best Practices / Web Design Guidelines | [Pinned upstream](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62). README explicitly declares **MIT**; React frontmatter agrees. No standalone root LICENSE at that revision. Declaration, provenance and standard grant: [Vercel-SKILLS-MIT.txt](docs/licenses/Vercel-SKILLS-MIT.txt). No copyright holder/year invented. |
| UI UX Pro Max | [Next Level Builder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/d643997c82e94742dd3bee43210b0198e8bbba3d), historical revision in REFERENCES.md; **MIT**, copyright 2024 Next Level Builder, original `.agents/skills/ui-ux-pro-max/LICENSE` retained. Absent from the existing skills lock; current files remain auditable. |
| Phosphor catalog metadata inside the UI/UX skill | Identifies core 2.1.1 / React 2.1.10; no Phosphor image binaries used by OrbitCare. [Current upstream MIT license](https://github.com/phosphor-icons/core/blob/main/LICENSE) retrieved November 16 and retained in [Phosphor-MIT.txt](docs/licenses/Phosphor-MIT.txt). A matching version tag was not located; do not imply otherwise. |
| Google Font catalogs/license metadata inside that skill | References, not downloaded font binaries. Skill MIT terms do not license every referenced font; individual declarations are in `google-font-licenses.json`. OrbitCare bundles only IBM Plex. |

No new third-party media, standalone music, private research record or model was added. Existing media paths remain intact for the demo/tests. Audit output, local bundles, traces, caches and optional audio-production sources stay ignored.
