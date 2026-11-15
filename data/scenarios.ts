import type { AppState, CheckIn, Workspace } from "@/lib/types";

export const SCENARIOS = [
  { id: "stable", name: "Stable reference", label: "Stable", description: "Ordinary variation around a fixed personal reference." },
  { id: "drift", name: "Sustained change", label: "Sustained change", description: "Several indicators depart from reference over consecutive days." },
  { id: "missing", name: "Missing readings", label: "Missing data", description: "Gaps interrupt comparison. Missing does not mean reassuring." },
  { id: "recovery", name: "Return to reference", label: "Return to reference", description: "Readings return toward reference; earlier flags remain inspectable." },
] as const;

const heart = [60, 61, 59, 62, 60, 58, 61, 60, 59, 62, 60, 61, 59, 60];
const sleep = [8, 7.8, 8.2, 8.1, 7.9, 8, 8.3, 7.8, 8.1, 8, 7.9, 8.2, 8, 8.1];

export function makeScenario(scenario: NonNullable<Workspace["scenario"]>): Workspace {
  const checkIns: CheckIn[] = Array.from({ length: 28 }, (_, index) => {
    const day = index + 1;
    const changed = (scenario === "drift" && day >= 22) || ((scenario === "recovery" || scenario === "missing") && day >= 18 && day <= 23);
    const absent = scenario === "missing" && day >= 26;
    return {
      id: `${scenario}-day-${day}`, day,
      heartRate: absent ? null : changed ? 69 + ((day - 18) % 4) : heart[index % 14],
      sleep: absent ? null : changed ? [6.2, 6.0, 5.8, 6.1][day % 4] : sleep[index % 14],
      fatigue: absent ? null : changed ? (day % 3 === 0 ? 5 : 4) : 2,
      exercise: absent ? null : changed ? 25 + (day % 3) * 5 : 55 + (day % 4) * 5,
      comparable: !(scenario === "missing" && day === 25),
      note: absent ? "No check-in recorded in this synthetic scenario." : changed ? "Illustrative workload context; cause of the changes is unknown." : "",
      origin: "synthetic", recordedAt: `2026-10-${String(day).padStart(2, "0")}T08:00:00.000Z`,
    };
  });
  return { id: scenario, scenario, kind: "scenario", name: SCENARIOS.find(item => item.id === scenario)!.name, referenceStart: 1, referenceEnd: 14, currentDay: 28, checkIns, reviews: [] };
}

export function initialState(): AppState {
  return { version: 1, activeId: "drift", workspaces: SCENARIOS.map(item => makeScenario(item.id)) };
}

export function customWorkspace(): Workspace {
  return { id: crypto.randomUUID(), name: "My test workspace", kind: "custom", scenario: null, referenceStart: 1, referenceEnd: 14, currentDay: 1, checkIns: [], reviews: [] };
}
