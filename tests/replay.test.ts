import { describe, expect, it } from "vitest";
import { makeScenario } from "@/data/scenarios";
import { analyze } from "@/lib/analysis";
import { knownTurningPoints, nextTurningPoint, replayNarrative, replayStage } from "@/lib/replay";

describe("decision replay uses the original analysis", () => {
  it("known milestones match the original engine at every as-of day without future data", () => {
    for (const scenario of ["stable", "drift", "missing", "recovery"] as const) {
      const workspace = makeScenario(scenario);
      for (const indicator of ["heartRate", "sleep", "fatigue"] as const) for (let day = 1; day <= 28; day++) {
        const expected: { firstChange?: number; persistence?: number; review?: number } = {};
        for (let cursor = 15; cursor <= day; cursor++) {
          const result = analyze(workspace, cursor).find(item => item.indicator === indicator)!;
          if (result.streak === 1) expected.firstChange ??= cursor;
          if (result.streak === 2) expected.persistence ??= cursor;
          if (result.streak >= 3) expected.review ??= cursor;
        }
        expect(knownTurningPoints(workspace, day, indicator)).toEqual(expected);
        expect(knownTurningPoints({ ...workspace, checkIns: workspace.checkIns.filter(row => row.day <= day) }, day, indicator)).toEqual(expected);
      }
    }
  });
  it("a missing calendar day breaks milestone persistence", () => {
    const workspace = makeScenario("drift");
    workspace.checkIns = workspace.checkIns.filter(row => row.day !== 23);
    expect(knownTurningPoints(workspace, 24, "heartRate")).toEqual({ firstChange: 22 });
    expect(knownTurningPoints(workspace, 26, "heartRate")).toEqual({ firstChange: 22, persistence: 25, review: 26 });
  });
  it("visits the reference, ordinary observation, first change, persistence and review", () => {
    const workspace = makeScenario("drift");
    const days = [14];
    while (days.at(-1)! < 28) days.push(nextTurningPoint(workspace, days.at(-1)!, "heartRate"));
    expect(days).toEqual([14, 15, 22, 23, 24, 28]);
    expect(days.map(day => replayStage(analyze(workspace, day)[0]))).toEqual(["reference", "steady", "first-change", "persistence", "review", "review"]);
  });
  it("distinguishes non-comparable readings and gaps", () => {
    const workspace = makeScenario("missing");
    expect(nextTurningPoint(workspace, 24, "heartRate")).toBe(25);
    expect(nextTurningPoint(workspace, 25, "heartRate")).toBe(26);
    expect(replayNarrative(analyze(workspace, 25)[0], 25).title).toBe("Keep the reading, exclude the comparison");
    expect(replayNarrative(analyze(workspace, 26)[0], 26).title).toBe("A gap is not a reassuring result");
  });
  it("has the same narrative regardless of future readings or reviews", () => {
    const full = makeScenario("drift");
    for (const day of [1, 10, 14, 21, 22, 23, 24]) {
      const truncated = { ...full, checkIns: full.checkIns.filter(row => row.day <= day) };
      expect(analyze(full, day).map(result => replayNarrative(result, day))).toEqual(analyze(truncated, day).map(result => replayNarrative(result, day)));
    }
  });
});
