import { describe, expect, it } from "vitest";
import { makeScenario } from "@/data/scenarios";
import { contactLabels, emergencyDrill, exportIncident, handoffText, historicalSnapshot, importIncident, incidentRegistrySchema, incidentSchema, newIncident, PROTOCOL_NOTICE } from "@/lib/crew-incident";
import { exportWorkspace, importWorkspace } from "@/lib/validation";

const now = "2026-11-15T09:00:00.000Z";
describe("crew incident boundaries and portability", () => {
  it("creates an empty record without inventing observations, event time or contact", () => {
    const record = { ...newIncident("incident-1", now), crewmember: "Fictional C02" };
    expect(incidentSchema.parse(record).measurements).toEqual({ text: "", observedAt: null, source: "unknown" });
    expect(record.incidentAt).toBeNull(); expect(record.history).toBeNull(); expect(record.contact.status).toBe("unknown");
    const handoff = handoffText(record); expect(handoff).toContain("Unknown / not recorded"); expect(handoff).toContain("No historical monitoring data included"); expect(handoff).toContain(PROTOCOL_NOTICE); expect(handoff).not.toContain("0 bpm");
  });
  it("reproduces one synthetic drill without clinical outcomes or fabricated vital signs", () => {
    expect(emergencyDrill()).toEqual(emergencyDrill());
    const drill = emergencyDrill(); expect(drill.mode).toBe("synthetic-drill"); expect(drill.measurements.text).toBe(""); expect(drill.contact.status).toBe("unknown"); expect(drill.actions).toBe("");
    const text = handoffText(drill); expect(text).toContain("SIMULATION / TRAINING ONLY"); expect(text).toContain("simulation clock"); expect(text).toContain("not an application detection");
  });
  it("copies only explicitly selected-day historical data and earlier local reviews", () => {
    const workspace = makeScenario("drift");
    workspace.reviews = [22,24].map(day => ({ id: `review-${day}`, day, indicator: "heartRate", action: "Add context", note: `day-${day}-only`, recordedAt: now }));
    const before = JSON.stringify(workspace);
    const history = historicalSnapshot(workspace, 22, now)!;
    expect(history.record?.day).toBe(22); expect(history.record?.recordedAt).toBe(workspace.checkIns.find(row => row.day === 22)?.recordedAt);
    expect(history.reviews.map(row => row.day)).toEqual([22]); expect(JSON.stringify(workspace)).toBe(before);
    const output = handoffText({ ...emergencyDrill(), history }); expect(output).toContain("never current incident measurements"); expect(output).toContain("Historical source: synthetic"); expect(output).not.toContain("day-24-only");
  });
  it("keeps missing historical observations unknown and rejects future snapshots", () => {
    const workspace = makeScenario("missing"); workspace.checkIns = workspace.checkIns.filter(row => row.day !== 22);
    const history = historicalSnapshot(workspace, 22, now)!; expect(history.record).toBeNull();
    expect(handoffText({ ...emergencyDrill(), history })).toContain("Selected-day historical observations are unknown");
    expect(incidentSchema.safeParse({ ...emergencyDrill(), history: { ...history, record: makeScenario("drift").checkIns.find(row => row.day === 24) } }).success).toBe(false);
  });
  it("never promotes user-reported contact confirmation into independent verification", () => {
    const record = { ...emergencyDrill(), contact: { status: "confirmation-reported" as const, detail: "User says the designated officer replied.", reportedAt: now } };
    const output = handoffText(record); expect(output).toContain(contactLabels["confirmation-reported"]); expect(output).toContain("not independently verified"); expect(output).toContain("OrbitCare has not contacted or notified anyone");
  });
  it("round-trips source and timestamps while marking an imported copy", () => {
    const record = { ...emergencyDrill(), savedAt: now, measurements: { text: "No measurement supplied", observedAt: null, source: "reported" as const } };
    const imported = importIncident(exportIncident(record, now), "new-id", now);
    expect(imported).toEqual({ ...record, id: "new-id", importedAt: now });
    expect(() => importWorkspace(exportIncident(record, now), "wrong")).toThrow();
    expect(() => importIncident(exportWorkspace(makeScenario("stable")), "wrong", now)).toThrow();
  });
  it("rejects invalid timestamps, unexpected claims, malformed and oversized exports", () => {
    const record = emergencyDrill();
    for (const change of [{ incidentAt: "not-a-date" }, { automaticDiagnosis: "unsupported" }, { crewmember: "" }, { notes: "x".repeat(2001) }]) expect(incidentSchema.safeParse({ ...record, ...change }).success).toBe(false);
    expect(() => importIncident("{bad", "id", now)).toThrow(); expect(() => importIncident(" ".repeat(2 * 1024 * 1024 + 1), "id", now)).toThrow("2 MB");
  });
  it("bounds local records and rejects duplicate IDs", () => {
    expect(incidentRegistrySchema.safeParse({ version: 1, incidents: [emergencyDrill(), emergencyDrill()] }).success).toBe(false);
    expect(incidentRegistrySchema.safeParse({ version: 1, incidents: Array.from({ length: 51 }, (_, index) => ({ ...emergencyDrill(), id: String(index) })) }).success).toBe(false);
  });
});
