import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parse } from "csv-parse/sync";
const bytes = await readFile("data/raw/OSD-575-CMP.csv");
const acquisition = JSON.parse(await readFile("data/raw/acquisition.json", "utf8"));
const sha256 = createHash("sha256").update(bytes).digest("hex");
if (sha256 !== "dab247eb794edab59aaaa683c85fd1f2dbf4ae3684872739338e10ead4192a0c") throw new Error("Unreviewed NASA source checksum.");
const rows = parse(bytes, { columns: true, bom: true, skip_empty_lines: true });
const visits = ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"];
const observations = rows.filter(row => ["SODIUM", "POTASSIUM"].includes(row.ANALYTE)).map(row => {
  if (row.UNITS !== "mmol/L" || !row.VALUE.trim() || !Number.isFinite(Number(row.VALUE)) || !visits.includes(row.timepoint)) throw new Error("Unexpected research observation.");
  return { participant: row.SUBJECT_ID, visit: row.timepoint, phase: row.timepoint.startsWith("L") ? "Pre-flight" : "Post-flight", analyte: row.ANALYTE, value: Number(row.VALUE), unit: row.UNITS };
});
const keys = observations.map(row => `${row.participant}/${row.visit}/${row.analyte}`);
if (observations.length !== 56 || new Set(keys).size !== 56) throw new Error("Incomplete or duplicate NASA subset.");
for (const analyte of ["SODIUM", "POTASSIUM"]) for (const participant of ["C001", "C002", "C003", "C004"]) {
  if (observations.filter(row => row.analyte === analyte && row.participant === participant).length !== 7) throw new Error("Unexpected sampling coverage.");
}
const data = {
  study: "OSD-575", version: 3, title: "Inspiration4 serum metabolic measurements", doi: "10.26030/mc5d-p710",
  ...acquisition, sha256, sourceRows: rows.length, selectedRows: observations.length,
  participants: ["C001", "C002", "C003", "C004"], visits,
  methodology: "Serum comprehensive metabolic panel, Quest Diagnostics test 10231, Beckman Coulter AU5800; four Inspiration4 participants on a three-day mission in September 2021.",
  license: "Study listing states CC0-1.0. The inspected metadata API omits a license field; retain OSDR attribution and redistribution policy.",
  policy: "https://science.nasa.gov/reference/osdr-help-terms-and-conditions/",
  limitations: ["Four participants, not 28 independent participants per marker.", "Ground samples before and after flight, not live or in-flight telemetry.", "Sampling visits are not equally spaced in time.", "R+194 occurs in the file although the study prose summarizes fewer timepoints.", "Other variables in the complete source include missing values. Only the selected subset has been validated here.", "No disease interpretation, alert calibration, causal attribution, or long-duration prediction is supported."],
  observations,
};
await writeFile("data/research.json", JSON.stringify(data, null, 2) + "\n");
await mkdir("public/research", { recursive: true });
await copyFile("data/raw/OSD-575-CMP.csv", "public/research/OSD-575-original.csv");
await writeFile("public/research/OSD-575-provenance.json", JSON.stringify(data, null, 2) + "\n");
console.log(`Prepared ${observations.length} verified research observations from ${rows.length} source rows.`);
