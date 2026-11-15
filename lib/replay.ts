import { analyze, comparableReading, meetsRule, referenceFor } from "./analysis";
import type { Indicator, Result, Workspace } from "./types";

// Presentation states only. All decisions and measurements come from analyze().
export function knownTurningPoints(workspace: Workspace, day: number, indicator: Indicator) {
  const reference = referenceFor(workspace, indicator, Math.min(day, workspace.referenceEnd));
  const points: { firstChange?: number; persistence?: number; review?: number } = {};
  if (!reference.sufficient) return points;
  let streak = 0, previous = workspace.referenceEnd;
  for (const row of workspace.checkIns.filter(row => row.day > workspace.referenceEnd && row.day <= day).sort((a, b) => a.day - b.day)) {
    if (row.day !== previous + 1) streak = 0;
    const value = comparableReading(row, indicator);
    streak = value !== null && meetsRule(value, indicator, reference) ? streak + 1 : 0;
    if (streak === 1) points.firstChange ??= row.day;
    if (streak === 2) points.persistence ??= row.day;
    if (streak === 3) points.review ??= row.day;
    if (points.review !== undefined) break;
    previous = row.day;
  }
  return points;
}

export function replayStage(result: Result) {
  if (result.status === "change") return result.streak === 1 ? "first-change" : "persistence";
  return result.status;
}

export function nextTurningPoint(workspace: Workspace, day: number, indicator: Indicator) {
  const stage = replayStage(analyze(workspace, day).find(result => result.indicator === indicator)!);
  for (let next = day + 1; next <= workspace.currentDay; next++) {
    const result = analyze(workspace, next).find(result => result.indicator === indicator)!;
    if (replayStage(result) !== stage) return next;
  }
  return workspace.currentDay;
}

export function replayNarrative(result: Result, day: number) {
  switch (replayStage(result)) {
    case "reference": return { title: "Establish the personal reference", text: `${result.reference.count} valid observations available by day ${day}. Days 1–14 form the fixed reference; later readings never silently update it.` };
    case "first-change": return { title: "A changed reading appears", text: "This reading meets the prototype change rule. One day is an observation to inspect; it has not met the three-day review rule." };
    case "persistence": return { title: "The change persists", text: `${result.streak} consecutive days meet the same change rule. The review flag needs three; missing or non-comparable data breaks the sequence.` };
    case "review": return { title: "The review rule is met", text: `${result.streak} consecutive changed days are available by day ${day}. Check the calculation and measurement quality, then record an appropriate review action. This is not a diagnosis.` };
    case "missing": return { title: "A gap is not a reassuring result", text: "No reading is available today. The consecutive-day sequence is broken, not filled with zero. Record the missing context before interpreting the pattern." };
    case "not-comparable": return { title: "Keep the reading, exclude the comparison", text: "The heart-rate reading is retained in the data table but marked non-comparable. It cannot extend the sequence or establish a reassuring result." };
    case "insufficient": return { title: "The reference is not sufficient", text: "A completed reference period and at least ten valid observations are needed. Check the reference quality; do not invent historical readings." };
    default: return { title: "Observe against the fixed reference", text: "This reading does not meet the prototype change rule. Earlier flags remain inspectable. An unflagged reading cannot establish health or safety." };
  }
}
