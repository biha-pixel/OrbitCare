import { z } from "zod";
import type { Workspace } from "./types";
import { checkInSchema, reviewSchema } from "./validation";

export const PROTOCOL_NOTICE = "No approved mission-specific emergency protocol is installed in this prototype.";
export const HANDOFF_LIMIT = "Research prototype. User-entered information is not independently verified. This handoff does not diagnose, prescribe care, establish safety or notify anyone.";
const text = z.string().max(2000);
const source = z.enum(["directly-observed", "reported", "unknown"]);
const timestamp = z.iso.datetime().nullable();
const historySchema = z.object({
  workspaceId: z.string().min(1).max(100), workspaceName: z.string().min(1).max(100),
  throughDay: z.number().int().min(1).max(9999), selectedAt: z.iso.datetime(),
  record: checkInSchema.nullable(), reviews: z.array(reviewSchema).max(5000),
}).strict().superRefine((history, context) => {
  if ((history.record && history.record.day > history.throughDay) || history.reviews.some(item => item.day > history.throughDay)) context.addIssue({ code: "custom", message: "Historical context must not include future records." });
});
export const incidentSchema = z.object({
  id: z.string().min(1).max(100), mode: z.enum(["user-entry", "synthetic-drill"]),
  crewmember: z.string().trim().min(1).max(100), missionContext: text,
  incidentAt: timestamp, createdAt: z.iso.datetime(), savedAt: timestamp, importedAt: timestamp,
  circumstances: text, circumstancesSource: source,
  measurements: z.object({ text, observedAt: timestamp, source }).strict(),
  missingInformation: text, actions: text,
  contact: z.object({ status: z.enum(["unknown", "not-reported", "attempt-reported", "confirmation-reported"]), detail: text, reportedAt: timestamp }).strict(),
  notes: text, history: historySchema.nullable(),
}).strict();
export type CrewIncident = z.infer<typeof incidentSchema>;
export const incidentRegistrySchema = z.object({ version: z.literal(1), incidents: z.array(incidentSchema).max(50) }).strict().superRefine((value, context) => {
  if (new Set(value.incidents.map(item => item.id)).size !== value.incidents.length) context.addIssue({ code: "custom", message: "Incident IDs must be unique." });
});
const portableSchema = z.object({ app: z.literal("OrbitCare"), kind: z.literal("crew-incident"), schemaVersion: z.literal(1), exportedAt: z.iso.datetime(), incident: incidentSchema }).strict();
export const contactLabels = {
  unknown: "Unknown / not recorded",
  "not-reported": "User reports no contact made",
  "attempt-reported": "User reports attempting contact",
  "confirmation-reported": "User reports contact confirmed",
} as const;
export const sourceLabels = { "directly-observed": "Entered as directly observed by the assisting user", reported: "Reported to the assisting user", unknown: "Source unknown / not recorded" } as const;

export function newIncident(id: string, now: string): CrewIncident {
  return { id, mode: "user-entry", crewmember: "", missionContext: "", incidentAt: null, createdAt: now, savedAt: null, importedAt: null, circumstances: "", circumstancesSource: "unknown", measurements: { text: "", observedAt: null, source: "unknown" }, missingInformation: "", actions: "", contact: { status: "unknown", detail: "", reportedAt: null }, notes: "", history: null };
}
export function emergencyDrill(): CrewIncident {
  return { ...newIncident("mars-day24-drill-v1", "2026-11-15T08:01:00.000Z"), mode: "synthetic-drill", crewmember: "SIM-CREW-01", missionContext: "Fictional Mars mission · day 24 · software workflow drill", incidentAt: "2026-11-15T08:00:00.000Z", circumstances: "An assisting crewmate reports finding SIM-CREW-01 unresponsive and unable to operate OrbitCare. This is a fictional scenario, not an application detection or medical assessment.", circumstancesSource: "reported", missingInformation: "Current vital signs, onset time and a medical assessment are unknown. No clinical outcome is supplied." };
}
export function historicalSnapshot(workspace: Workspace, day: number, now: string): CrewIncident["history"] {
  const throughDay = Math.min(Math.max(1, day), workspace.currentDay);
  return historySchema.parse({ workspaceId: workspace.id, workspaceName: workspace.name, throughDay, selectedAt: now, record: workspace.checkIns.find(row => row.day === throughDay) ?? null, reviews: workspace.reviews.filter(row => row.day <= throughDay) });
}
export function exportIncident(incident: CrewIncident, now = new Date().toISOString()): string {
  return JSON.stringify(portableSchema.parse({ app: "OrbitCare", kind: "crew-incident", schemaVersion: 1, exportedAt: now, incident }), null, 2);
}
export function importIncident(value: string, id: string, now: string): CrewIncident {
  if (new TextEncoder().encode(value).length > 2 * 1024 * 1024) throw new Error("Incident import must be smaller than 2 MB.");
  const parsed = portableSchema.parse(JSON.parse(value));
  return incidentSchema.parse({ ...parsed.incident, id, importedAt: now });
}
const known = (value: string | null) => value || "Unknown / not recorded";
export function handoffText(incident: CrewIncident): string {
  const record = incidentSchema.parse(incident);
  const history = record.history;
  return [
    "OrbitCare — Crew incident handoff", HANDOFF_LIMIT,
    record.mode === "synthetic-drill" ? "SIMULATION / TRAINING ONLY — all incident information is synthetic. No clinical outcome is asserted." : "USER-ENTERED INCIDENT — fictional identifiers only; all information supplied by the user.",
    `Incident ID: ${record.id}`, `Fictional crewmember: ${record.crewmember}`, `Mission context: ${known(record.missionContext)}`,
    `Incident time (UTC; ${record.mode === "synthetic-drill" ? "simulation clock" : "user entered"}): ${known(record.incidentAt)}`,
    `Record created (UTC): ${record.createdAt}`, `Last saved (UTC): ${known(record.savedAt)}`, `Imported (UTC): ${known(record.importedAt)}`,
    "", "Circumstances", sourceLabels[record.circumstancesSource], known(record.circumstances),
    "", "Current measured observations — user entered; not independently verified", sourceLabels[record.measurements.source], `Observation time (UTC): ${known(record.measurements.observedAt)}`, known(record.measurements.text),
    "", "Important missing information", known(record.missingInformation),
    "", "Actions reported by the assisting user — not instructions or independently verified actions", known(record.actions),
    "", "Contact status — user report only", contactLabels[record.contact.status], `Report time (UTC): ${known(record.contact.reportedAt)}`, known(record.contact.detail), "OrbitCare has not contacted or notified anyone.",
    "", "Historical monitoring context — explicitly selected; never current incident measurements",
    history ? `User confirmed fictional identity match. Workspace: ${history.workspaceName} (${history.workspaceId}); through mission day ${history.throughDay}; selected ${history.selectedAt}. Identity is not verified by OrbitCare.` : "Not selected. No historical monitoring data included.",
    ...(history ? [history.record ? `Historical source: ${history.record.origin}; mission day ${history.record.day}; recorded ${history.record.recordedAt}. Resting heart rate: ${history.record.heartRate ?? "Unknown"} bpm; sleep: ${history.record.sleep ?? "Unknown"} hours; fatigue: ${history.record.fatigue ?? "Unknown"} (illustrative 1–5); exercise context: ${history.record.exercise ?? "Unknown"} minutes. Heart-rate comparability recorded: ${history.record.comparable}. Context: ${known(history.record.note)}` : "Selected-day historical observations are unknown / unavailable.", ...history.reviews.map(row => `Historical local review — day ${row.day}; ${row.indicator}; ${row.action}; ${row.recordedAt}; ${known(row.note)}. No message implied.`)] : []),
    "", "Additional user notes", known(record.notes), "", PROTOCOL_NOTICE,
    "Use actual approved mission procedures, designated trained medical personnel and communication channels outside OrbitCare. Exporting or printing this file does not transmit a message.",
    "Same-device local record only. No cloud synchronization or production-grade medical data security is claimed.",
  ].join("\n");
}
