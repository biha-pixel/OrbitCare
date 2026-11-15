import type { CheckIn, Indicator, Reference, Result, Workspace } from "./types";

export const INDICATORS: Indicator[] = ["heartRate", "sleep", "fatigue"];
export const METRICS = {
  heartRate: { name: "Resting heart rate", short: "Heart rate", unit: "bpm", floor: 8, color: "#007F78" },
  sleep: { name: "Sleep duration", short: "Sleep", unit: "h", floor: 1.5, color: "#5077A0" },
  fatigue: { name: "Self-reported fatigue", short: "Fatigue", unit: "/ 5", floor: 2, color: "#9A5B00" },
  exercise: { name: "Exercise duration", short: "Exercise", unit: "min", floor: 0, color: "#667A75" },
} as const;
export const RULE_VERSION = "1.0.0";
export const MIN_REFERENCE = 10;

export function median(values: number[]): number {
  if (!values.length) throw new Error("A median requires at least one observation.");
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function comparableReading(row: CheckIn | undefined, indicator: Indicator): number | null {
  if (!row || (indicator === "heartRate" && !row.comparable)) return null;
  return row[indicator];
}

export function referenceFor(workspace: Workspace, indicator: Indicator, asOf: number): Reference {
  const values = workspace.checkIns
    .filter(row => row.day >= workspace.referenceStart && row.day <= workspace.referenceEnd && row.day <= asOf)
    .map(row => comparableReading(row, indicator))
    .filter((value): value is number => value !== null);
  const sorted = [...values].sort((a, b) => a - b);
  const center = values.length ? (indicator === "fatigue" ? sorted[Math.floor((sorted.length - 1) / 2)] : median(values)) : null;
  const variation = center === null || indicator === "fatigue" ? null : 1.4826 * median(values.map(value => Math.abs(value - center)));
  return {
    count: values.length,
    median: center,
    variation,
    threshold: Math.max(METRICS[indicator].floor, (variation ?? 0) * 3),
    sufficient: values.length >= MIN_REFERENCE && asOf >= workspace.referenceEnd,
  };
}

export function meetsRule(value: number, indicator: Indicator, reference: Reference): boolean {
  if (!reference.sufficient || reference.median === null) return false;
  const delta = value - reference.median;
  const epsilon = 1e-9;
  if (indicator === "heartRate") return Math.abs(delta) + epsilon >= reference.threshold;
  if (indicator === "sleep") return -delta + epsilon >= reference.threshold;
  return delta + epsilon >= 2;
}

export function analyze(workspace: Workspace, day: number): Result[] {
  const readings = new Map(workspace.checkIns.map(row => [row.day, row]));
  return INDICATORS.map(indicator => {
    const reference = referenceFor(workspace, indicator, day);
    const row = readings.get(day);
    const value = comparableReading(row, indicator);
    let streak = 0;
    if (day > workspace.referenceEnd && reference.sufficient) {
      for (let cursor = day; cursor > workspace.referenceEnd; cursor--) {
        const candidate = comparableReading(readings.get(cursor), indicator);
        if (candidate === null || !meetsRule(candidate, indicator, reference)) break;
        streak++;
      }
    }
    let status: Result["status"] = "steady";
    if (day <= workspace.referenceEnd) status = "reference";
    else if (!reference.sufficient) status = "insufficient";
    else if (row?.[indicator] === null || !row) status = "missing";
    else if (indicator === "heartRate" && !row.comparable) status = "not-comparable";
    else if (streak >= 3) status = "review";
    else if (streak > 0) status = "change";
    return { indicator, reference, value, delta: value === null || reference.median === null ? null : value - reference.median, streak, status, ruleId: `OC-${indicator}-${RULE_VERSION}` };
  });
}

export const STATUS_LABELS: Record<Result["status"], string> = {
  reference: "Reference period", insufficient: "Insufficient reference", missing: "Reading missing",
  "not-comparable": "Not comparable", steady: "No sustained deviation", change: "Change observed", review: "Review suggested",
};

export function formatValue(value: number | null, metric: string): string {
  if (value === null) return "—";
  return metric === "sleep" ? value.toFixed(1) : Number.isInteger(value) ? String(value) : value.toFixed(1);
}
