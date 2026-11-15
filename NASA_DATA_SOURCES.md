# NASA sources and data provenance

## Integrated research context

| Source | Classification | Actual use and limitation |
|---|---|---|
| [Standard Measures](https://www.nasa.gov/reference/standard-measures/) | Informational human-spaceflight repeated-measure research overview; activity/sleep collection, not a downloaded monitoring table | Longitudinal/contextual monitoring evidence. No OrbitCare thresholds supplied. |
| [Sleep and irregular schedules risk](https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/) | Human-spaceflight research guidance, not an integrated numerical dataset | Sleep/circadian context. Does not validate the fatigue scale or rules. |
| [HRP risks](https://www.nasa.gov/hrp/risks/) | Human physiological risk/adaptation overview | Heart-rate/exercise context; no fitness or diagnostic conclusion. |
| [Cardiovascular adaptations](https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/) | Human-spaceflight risk research overview; no numerical feed | Direct research-to-indicator mapping in the body explorer and heart-rate explanation. Pulse alone cannot diagnose disease. |
| [Five hazards](https://www.nasa.gov/hrp/hazards/) | Human-spaceflight hazard overview | Method/evidence scope boundary and distance/altered-gravity context; no radiation or organ sensor is claimed. |
| [Health and medical care](https://www.nasa.gov/reference/3-0-health-and-medical-care/) | Published NASA-STD-3001 care requirements, especially §§3.1, 3.4, 3.5 | Urgent signpost and medical-responsibility boundaries. Not an implementable emergency treatment protocol or certification. |
| [Medical training](https://www.nasa.gov/reference/5-0-training/) | Published NASA-STD-3001 training requirements, especially §5.2.1 | Explains why approved procedures and trained crew medical personnel are required. No treatment or CPR instructions are implemented. |

Concise paraphrased evidence and original URLs are bundled offline. Original external pages require connectivity. These resources establish relevance, not medical validity of the software.

## Numerical integration: OSD-575

- [Original study](https://osdr.nasa.gov/bio/repo/data/studies/OSD-575), inspected metadata version 3; DOI [10.26030/mc5d-p710](https://doi.org/10.26030/mc5d-p710).
- [Original CSV](https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?source=datamanager&file=LSDS-8_Comprehensive_Metabolic_Panel_CMP.upload_SUBMITTED.csv): `LSDS-8_Comprehensive_Metabolic_Panel_CMP.upload_SUBMITTED.csv`.
- 25,275 bytes; 531 parsed records; acquisition `2026-11-15T01:08:12.094Z`, recorded in `data/raw/acquisition.json`.
- SHA-256: `dab247eb794edab59aaaa683c85fd1f2dbf4ae3684872739338e10ead4192a0c`.
- Population: four coded human Inspiration4 participants C001–C004; three-day mission in September 2021. No identities inferred.
- Method: serum comprehensive metabolic panel, Quest Diagnostics test 10231; metadata identifies Beckman Coulter AU5800.
- Selected variables: SODIUM and POTASSIUM; original units **mmol/L**.
- File sampling labels: L-92, L-44, L-3, R+1, R+45, R+82, R+194.
- Selected subset: 56 numeric observations, 28 per analyte, seven visits per participant; no duplicate participant/visit/analyte keys.
- Other source variables contain missingness. Completeness is claimed only for this selected subset.
- R+194 is present in the file although study prose summarizes fewer visits. Preserve and disclose the discrepancy.

### Reproducibility

`data/raw/OSD-575-CMP.csv` preserves original bytes. `scripts/fetch-nasa.mjs` explicitly downloads the identified source and rejects an unexpected checksum. `scripts/prepare-data.mjs` verifies the checksum, parses CSV, selects analytes, preserves values/units/codes/labels, checks expected uniqueness/completeness, and writes `data/research.json`.

The build copies source/provenance to `/research/OSD-575-original.csv` and `/research/OSD-575-provenance.json`. It makes no runtime NASA request. Source-integrity tests compare all 56 observations against the original file.

The view uses discrete observations and an accessible table, with categorical sampling positions and a pre-/post-flight gap. No interpolated in-flight measurements, continuous telemetry, clinical bands, disease interpretation, causal attribution, or monitoring alerts are added. NASA research values cannot enter the monitoring model.

### Permissions and citation

The selected CSV was publicly downloadable without authentication. The indexed study listing states CC0-1.0; the inspected metadata API has no license field. Retain study attribution, DOI, exact source, provenance, and [OSDR terms/citation guidance](https://science.nasa.gov/reference/osdr-help-terms-and-conditions/). Do not describe all NASA material as public domain. OrbitCare's MIT license applies to its code, not third-party research. No controlled assays or private astronaut records are used.

## Examined and excluded

| Resource | Classification and decision |
|---|---|
| [HRP](https://www.nasa.gov/hrp/), [roadmap](https://humanresearchroadmap.nasa.gov/Risks/), [ongoing research](https://www.nasa.gov/hrp/ongoing-hrp-research/) | Research/discovery guidance; overview pages do not establish a daily vital-sign dataset or alert thresholds. Five hazards is now actually used in the evidence/scope explanation above. |
| [OSDR](https://science.nasa.gov/biological-physical/data/osdr/), [BPS](https://science.nasa.gov/biological-physical/data/), [biological API](https://visualization.osdr.nasa.gov/biodata/api/) | Repository/API discovery, not runtime integrations. Population/units/methods/access are study-specific. |
| [Inspiration4 catalog](https://osdr.nasa.gov/bio/repo/data/missions/SpaceX%20Inspiration4), [NASA explanation](https://www.nasa.gov/osdr-latest-news-i4-mission-datasets/) | Mission/study discovery. Short-duration research is not long-duration telemetry. |
| [OSD-569](https://osdr.nasa.gov/bio/repo/data/studies/OSD-569) | Public CBC CSV inspected; ground visits and assay-specific units. Excluded to avoid duplicating the laboratory explorer. Other assays have different access requirements. |
| [NLSP](https://nlsp.nasa.gov/), [catalog entry](https://data.nasa.gov/dataset/nasa-life-sciences-portal-nlsp) | Portal content unreadable through the research tool, catalog license unspecified. No suitable numerical download validated; excluded. |

Examined sources are not claimed as implemented data integrations. Challenge/submission rules are distinct from scientific evidence; unverified current-guide details remain marked in SUBMISSION_CHECKLIST.md.

During the alignment upgrade the original NASA overview/standard pages were re-inspected. OSD-575's browser page returned no readable study text; the previously verified source snapshot, acquisition record and value/checksum tests remain the basis of the unchanged numerical integration. No source data were refreshed or replaced.

The requested Canadian Space Agency radiation-monitoring article and space-science overview were inspected but are not implemented data integrations or sources for OrbitCare thresholds. The app has no radiation measurement capability. See CHALLENGE_ALIGNMENT.md for the full source audit and feature matrix.

## Judge-first resource verification — 15 November 2026

A real browser retrieved HTTP 200 from the [official challenge Resources tab](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources). It lists Five Hazards, Risks of Human Spaceflight and Ongoing HRP Research, plus two CSA educational resources. Evidence is retained in `artifacts/judge-final/challenge-resource-inspection.json`. This supersedes the earlier direct-retrieval limitation for the challenge resource list.

The first two NASA resources are used in OrbitCare’s method/evidence and body-context scope explanations. The new research connections explicitly trace the Risks overview to specialist cardiovascular and sleep context. Standard Measures informs the repeated-observation context; published medical-care requirements inform boundaries. These are contextual/design connections, not evidence validating the fixed reference duration, thresholds or persistence rule. OSD-575 is an additional original-data integration; it is not presented as a directly listed challenge resource. All 56 values, units and provenance remain unchanged.
