export type Indicator = "heartRate" | "sleep" | "fatigue";
export type Metric = Indicator | "exercise";
export type CheckIn = {
  id: string;
  day: number;
  heartRate: number | null;
  sleep: number | null;
  fatigue: number | null;
  exercise: number | null;
  comparable: boolean;
  note: string;
  origin: "synthetic" | "user-entry";
  recordedAt: string;
};
export type Review = {
  id: string;
  day: number;
  indicator: Indicator;
  action: "Verify measurement" | "Add context" | "Request medical review";
  note: string;
  recordedAt: string;
};
export type Workspace = {
  id: string;
  name: string;
  kind: "scenario" | "custom" | "imported";
  scenario: "stable" | "drift" | "missing" | "recovery" | null;
  referenceStart: number;
  referenceEnd: number;
  currentDay: number;
  checkIns: CheckIn[];
  reviews: Review[];
};
export type Reference = {
  count: number;
  median: number | null;
  variation: number | null;
  threshold: number;
  sufficient: boolean;
};
export type Result = {
  indicator: Indicator;
  reference: Reference;
  value: number | null;
  delta: number | null;
  streak: number;
  status: "reference" | "insufficient" | "missing" | "not-comparable" | "steady" | "change" | "review";
  ruleId: string;
};
export type AppState = { version: 1; activeId: string; workspaces: Workspace[] };
