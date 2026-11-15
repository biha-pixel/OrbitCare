import { z } from "zod";
import type { AppState, Workspace } from "./types";
import { RULE_VERSION } from "./analysis";

const finite = (min: number, max: number) => z.number().finite().min(min).max(max).nullable();
export const checkInSchema = z.object({
  id: z.string().min(1).max(100), day: z.number().int().min(1).max(9999),
  heartRate: finite(20, 250), sleep: finite(0, 24), fatigue: z.number().int().min(1).max(5).nullable(),
  exercise: finite(0, 1440), comparable: z.boolean(), note: z.string().max(1000),
  origin: z.enum(["synthetic", "user-entry"]), recordedAt: z.iso.datetime(),
}).strict();
export const reviewSchema = z.object({
  id: z.string().min(1).max(100), day: z.number().int().min(1).max(9999),
  indicator: z.enum(["heartRate", "sleep", "fatigue"]),
  action: z.enum(["Verify measurement", "Add context", "Request medical review"]),
  note: z.string().max(1000), recordedAt: z.iso.datetime(),
}).strict();
export const workspaceSchema = z.object({
  id: z.string().min(1).max(100), name: z.string().min(1).max(100), kind: z.enum(["scenario", "custom", "imported"]),
  scenario: z.enum(["stable", "drift", "missing", "recovery"]).nullable(),
  referenceStart: z.number().int().min(1).max(9999), referenceEnd: z.number().int().min(1).max(9999),
  currentDay: z.number().int().min(1).max(9999), checkIns: z.array(checkInSchema).max(9999), reviews: z.array(reviewSchema).max(5000),
}).strict().superRefine((workspace, context) => {
  if (workspace.referenceStart !== 1 || workspace.referenceEnd !== 14) context.addIssue({ code: "custom", message: "This prototype uses the fixed reference days 1–14." });
  const days = workspace.checkIns.map(row => row.day);
  if (new Set(days).size !== days.length) context.addIssue({ code: "custom", message: "Duplicate check-in days are not allowed." });
  const ids = workspace.checkIns.map(row => row.id);
  if (new Set(ids).size !== ids.length) context.addIssue({ code: "custom", message: "Duplicate check-in IDs are not allowed." });
  if (new Set(workspace.reviews.map(review => review.id)).size !== workspace.reviews.length) context.addIssue({ code: "custom", message: "Duplicate review IDs are not allowed." });
  if (workspace.checkIns.some(row => row.day > workspace.currentDay)) context.addIssue({ code: "custom", message: "Check-ins cannot be later than the workspace clock." });
  if (workspace.reviews.some(row => row.day > workspace.currentDay)) context.addIssue({ code: "custom", message: "Review days cannot be later than the workspace clock." });
});
export const appStateSchema = z.object({ version: z.literal(1), activeId: z.string(), workspaces: z.array(workspaceSchema).min(1).max(100) }).strict().superRefine((state, context) => {
  if (!state.workspaces.some(workspace => workspace.id === state.activeId)) context.addIssue({ code: "custom", message: "Active workspace not found." });
  if (new Set(state.workspaces.map(workspace => workspace.id)).size !== state.workspaces.length) context.addIssue({ code: "custom", message: "Workspace IDs must be unique." });
});
const exportSchema = z.object({
  schemaVersion: z.literal(1), app: z.literal("OrbitCare"), ruleVersion: z.literal(RULE_VERSION),
  exportedAt: z.iso.datetime(), units: z.object({ heartRate: z.literal("bpm"), sleep: z.literal("hours"), fatigue: z.literal("ordinal-1-5"), exercise: z.literal("minutes") }).strict(),
  workspace: workspaceSchema,
}).strict();
export function exportWorkspace(workspace: Workspace): string {
  return JSON.stringify(exportSchema.parse({ schemaVersion: 1, app: "OrbitCare", ruleVersion: RULE_VERSION, exportedAt: new Date().toISOString(), units: { heartRate: "bpm", sleep: "hours", fatigue: "ordinal-1-5", exercise: "minutes" }, workspace }), null, 2);
}
export function importWorkspace(text: string, id: string): Workspace {
  if (new TextEncoder().encode(text).length > 2 * 1024 * 1024) throw new Error("Import must be smaller than 2 MB.");
  const parsed = exportSchema.parse(JSON.parse(text));
  return { ...parsed.workspace, id, name: `${parsed.workspace.name.slice(0, 85)} (imported)`, kind: "imported" };
}
export function validateState(state: unknown): AppState { return appStateSchema.parse(state); }
