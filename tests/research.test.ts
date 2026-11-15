import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { parse } from "csv-parse/sync";
import research from "@/data/research.json";
describe("NASA provenance and original-unit subset", () => {
  const bytes = readFileSync("data/raw/OSD-575-CMP.csv");
  const original = parse(bytes, { columns: true, bom: true, skip_empty_lines: true }) as Record<string, string>[];
  it("matches the independently inspected source checksum", () => { expect(createHash("sha256").update(bytes).digest("hex")).toBe("dab247eb794edab59aaaa683c85fd1f2dbf4ae3684872739338e10ead4192a0c"); expect(original).toHaveLength(531); });
  it("matches every selected observation to the raw file without normalization", () => { expect(research.observations).toHaveLength(56); for (const row of research.observations) { const source = original.find(item => item.SUBJECT_ID === row.participant && item.timepoint === row.visit && item.ANALYTE === row.analyte); expect(source).toBeDefined(); expect(row.value).toBe(Number(source!.VALUE)); expect(row.unit).toBe(source!.UNITS); } });
  it("has four repeated-measures participants, seven visits, and no duplicate keys", () => { expect(new Set(research.observations.map(row => row.participant)).size).toBe(4); expect(research.visits).toHaveLength(7); expect(new Set(research.observations.map(row => `${row.participant}/${row.visit}/${row.analyte}`)).size).toBe(56); expect(research.observations.every(row => row.unit === "mmol/L" && Number.isFinite(row.value))).toBe(true); });
});
