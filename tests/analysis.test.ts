import { describe, expect, it } from "vitest";
import { analyze, median, referenceFor, meetsRule } from "@/lib/analysis";
import { makeScenario } from "@/data/scenarios";
import type { Workspace } from "@/lib/types";
function changed(): Workspace {
  const workspace = makeScenario("stable");
  workspace.checkIns = workspace.checkIns.map(row => row.day >= 15 ? { ...row, heartRate: 68, sleep: 6.5, fatigue: 4 } : row);
  return workspace;
}
describe("reference statistics", () => {
  it("calculates odd and even medians without modifying input", () => { const input = [8, 2, 4, 6]; expect(median(input)).toBe(5); expect(input).toEqual([8, 2, 4, 6]); expect(median([9, 1, 5])).toBe(5); expect(() => median([])).toThrow(); });
  it("uses scaled MAD and the documented floor", () => { const ref = referenceFor(makeScenario("stable"), "heartRate", 28); expect(ref.median).toBe(60); expect(ref.variation).toBeCloseTo(1.4826); expect(ref.threshold).toBe(8); expect(ref.count).toBe(14); });
  it("handles a constant reference without dividing by zero", () => { const w = makeScenario("stable"); w.checkIns = w.checkIns.map(row => ({ ...row, heartRate: 60 })); expect(referenceFor(w, "heartRate", 28).variation).toBe(0); expect(referenceFor(w, "heartRate", 28).threshold).toBe(8); });
  it("uses the lower median category for fatigue", () => { const w = makeScenario("stable"); w.checkIns = w.checkIns.map(row => ({ ...row, fatigue: row.day <= 7 ? 1 : 4 })); expect(referenceFor(w, "fatigue", 28).median).toBe(1); expect(referenceFor(w, "fatigue", 28).variation).toBeNull(); });
  it("requires ten valid readings independently per indicator", () => { const w = makeScenario("stable"); w.checkIns = w.checkIns.map(row => row.day <= 5 ? { ...row, heartRate: null } : row); expect(analyze(w, 28)[0].status).toBe("insufficient"); expect(analyze(w, 28)[1].status).toBe("steady"); });
  it("does not complete the reference early", () => { expect(referenceFor(makeScenario("stable"), "heartRate", 10).sufficient).toBe(false); expect(analyze(makeScenario("stable"), 10)[0].status).toBe("reference"); });
  it("never silently includes later measurements in the reference", () => { const w = changed(); expect(referenceFor(w, "heartRate", 28)).toEqual(referenceFor(w, "heartRate", 14)); });
  it("does not use future reference observations during replay", () => { const w = makeScenario("stable"); w.checkIns = w.checkIns.map(row => row.day > 7 ? { ...row, heartRate: 200 } : row); expect(referenceFor(w, "heartRate", 7).median).toBe(60); expect(referenceFor(w, "heartRate", 7).count).toBe(7); });
});
describe("transparent persistence rules", () => {
  it("includes exact boundaries and waits for three consecutive days", () => { const w = changed(); expect(analyze(w, 15).map(result => result.status)).toEqual(["change", "change", "change"]); expect(analyze(w, 16)[0].streak).toBe(2); expect(analyze(w, 17).map(result => result.status)).toEqual(["review", "review", "review"]); });
  it("detects either heart-rate direction", () => { const ref = referenceFor(makeScenario("stable"), "heartRate", 28); expect(meetsRule(52, "heartRate", ref)).toBe(true); expect(meetsRule(68, "heartRate", ref)).toBe(true); expect(meetsRule(67.9, "heartRate", ref)).toBe(false); });
  it("does not flag longer sleep or lower fatigue", () => { const w = makeScenario("stable"); expect(meetsRule(10, "sleep", referenceFor(w, "sleep", 28))).toBe(false); expect(meetsRule(1, "fatigue", referenceFor(w, "fatigue", 28))).toBe(false); });
  it("missing days break persistence instead of being skipped", () => { const w = changed(); w.checkIns = w.checkIns.filter(row => row.day !== 16); expect(analyze(w, 16)[0].status).toBe("missing"); expect(analyze(w, 17)[0].streak).toBe(1); });
  it("non-comparable heart rate breaks only its own sequence", () => { const w = changed(); w.checkIns[15].comparable = false; expect(analyze(w, 16)[0].status).toBe("not-comparable"); expect(analyze(w, 17)[0].streak).toBe(1); expect(analyze(w, 17)[1].status).toBe("review"); });
  it("accepts zero sleep as an observation, not a gap", () => { const w = changed(); w.checkIns[27].sleep = 0; expect(analyze(w, 28)[1].value).toBe(0); expect(analyze(w, 28)[1].status).toBe("review"); });
  it("acknowledgment does not clear calculated flags", () => { const w = changed(); const before = analyze(w, 28); w.reviews.push({ id: "r", day: 28, indicator: "heartRate", action: "Verify measurement", note: "Checked", recordedAt: "2026-11-15T00:00:00Z" }); expect(analyze(w, 28)).toEqual(before); });
  it("never leaks future changes into earlier decisions", () => { const w = changed(); const before = analyze(w, 17); w.checkIns = w.checkIns.map(row => row.day > 17 ? { ...row, heartRate: 220, sleep: 0, fatigue: 5 } : row); expect(analyze(w, 17)).toEqual(before); });
  it("reproduces all four scenario outcomes", () => { expect(analyze(makeScenario("stable"), 28).every(row => row.status === "steady")).toBe(true); expect(analyze(makeScenario("drift"), 28).every(row => row.status === "review")).toBe(true); expect(analyze(makeScenario("missing"), 28).every(row => row.status === "missing")).toBe(true); expect(analyze(makeScenario("recovery"), 28).every(row => row.status === "steady")).toBe(true); expect(analyze(makeScenario("recovery"), 21).some(row => row.status === "review")).toBe(true); });
});
