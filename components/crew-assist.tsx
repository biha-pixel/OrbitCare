"use client";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowDownToLine, FileText, Printer, ShieldAlert } from "lucide-react";
import { contactLabels, emergencyDrill, exportIncident, handoffText, historicalSnapshot, importIncident, incidentSchema, newIncident, sourceLabels, type CrewIncident } from "@/lib/crew-incident";
import { loadIncidents, saveIncidents } from "@/lib/crew-persistence";
import type { Workspace } from "@/lib/types";
import EmergencyGuidance from "./emergency-guidance";

function localTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
const utcTime = (value: string) => value ? new Date(value).toISOString() : null;
function download(text: string, extension: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a"); link.href = url; link.download = `OrbitCare-crew-handoff.${extension}`; document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function TextField({ label, value, onChange, help }: { label: string; value: string; onChange: (value: string) => void; help?: string }) {
  return <label className="field crew-field"><span>{label}</span>{help && <small>{help}</small>}<textarea name={label.toLowerCase().replace(/[^a-z0-9]+/g, "-")} rows={3} maxLength={2000} value={value} onChange={event => onChange(event.target.value)} /></label>;
}
export default function CrewAssist({ workspace, day, onDirtyChange }: { workspace: Workspace; day: number; onDirtyChange: (dirty: boolean) => void }) {
  const [incidents, setIncidents] = useState<CrewIncident[]>([]);
  const [draft, setDraft] = useState<CrewIncident | null>(null);
  const [stage, setStage] = useState<"guidance" | "briefing" | "document" | "handoff">("guidance");
  const [prepared, setPrepared] = useState<CrewIncident | null>(null);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const drill = draft?.mode === "synthetic-drill";
  useEffect(() => { heading.current?.focus({ preventScroll: true }); let active = true; loadIncidents().then(records => { if (active) setIncidents(records); }).catch(() => { if (active) { setBlocked(true); setError("Local incident storage is unavailable or invalid. Existing records have not been overwritten. You may prepare and export a session handoff."); } }).finally(() => { if (active) setReady(true); }); return () => { active = false; }; }, []);
  useEffect(() => { onDirtyChange(dirty); return () => onDirtyChange(false); }, [dirty, onDirtyChange]);
  useEffect(() => { if (stage !== "guidance") stageHeading.current?.focus(); }, [stage]);
  useEffect(() => { if (!dirty) return; const warn = (event: BeforeUnloadEvent) => event.preventDefault(); window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  function begin(isDrill: boolean) {
    if (dirty && !window.confirm("Discard the unsaved incident draft? Saved incidents will remain.")) return;
    setDraft(isDrill ? emergencyDrill() : newIncident(crypto.randomUUID(), new Date().toISOString()));
    setPrepared(null); setStage(isDrill ? "briefing" : "document"); setDirty(false); setError(""); setMessage("");
  }
  function change(next: CrewIncident) { setDraft(next); setPrepared(null); setDirty(true); setMessage(""); setError(""); }
  async function save(prepare: boolean) {
    if (!draft || busy || !ready) return;
    const validated = incidentSchema.safeParse({ ...draft, savedAt: blocked ? null : new Date().toISOString() });
    if (!validated.success) { setError("Enter a fictional crewmember identifier and valid timestamps. Keep each note within 2,000 characters. Unknown observations may remain blank."); if (!draft.crewmember.trim()) document.getElementById("crew-identifier")?.focus(); return; }
    const record = validated.data;
    setBusy(true); setError("");
    try {
      if (blocked) { setMessage("Session handoff only — not saved on this device. Export before leaving."); }
      else { const next = [...incidents.filter(item => item.id !== record.id), record]; await saveIncidents(next); setIncidents(next); setMessage("Incident saved on this device. No contact or notification was made."); }
      setDraft(record); setDirty(blocked);
      if (prepare) { setPrepared(record); setStage("handoff"); }
    } catch { setError("The incident could not be saved. Your draft remains in this session. Export a handoff to keep it; local storage holds at most 50 incidents."); if (prepare) { const session = { ...record, savedAt: null }; setPrepared(session); setStage("handoff"); } }
    finally { setBusy(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void save(true); }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    if (dirty && !window.confirm("Replace the unsaved draft with the imported incident? Saved incidents remain.")) return;
    try { if (file.size > 2 * 1024 * 1024) throw new Error(); const record = importIncident(await file.text(), crypto.randomUUID(), new Date().toISOString()); setDraft({ ...record, savedAt: null }); setPrepared(null); setStage("document"); setDirty(true); setMessage("Incident imported as an unsaved draft. Source labels and contact statements are unverified user-supplied information."); setError(""); }
    catch { setError("Import rejected. Choose a valid OrbitCare crew-incident JSON export smaller than 2 MB. Existing records are unchanged."); }
  }
  function openSaved(record: CrewIncident) { if (dirty && !window.confirm("Discard the unsaved draft and open this saved incident?")) return; setDraft(record); setPrepared(record); setStage("handoff"); setDirty(false); setMessage(""); }
  async function remove(id: string) {
    if (busy || !window.confirm("Delete this local incident from this device? Export first if needed. Downloaded copies will remain.")) return;
    setBusy(true);
    try { const next = incidents.filter(item => item.id !== id); await saveIncidents(next); setIncidents(next); if (draft?.id === id) { setDraft(null); setPrepared(null); setStage("guidance"); setDirty(false); } setMessage("Local incident deleted. Downloaded copies were not removed."); }
    catch { setError("The record could not be deleted; stored incidents remain unchanged."); }
    finally { setBusy(false); }
  }
  return <div className="crew-assist">
    <div className="crew-screen">
      <header className="crew-heading"><div><p>Crew Assist · same device</p><h1 ref={heading} tabIndex={-1}>Help a crewmate.</h1><p>Urgent guidance first. Optional documentation afterwards.</p></div><ShieldAlert size={34} aria-hidden="true" /></header>
      {drill && <div className="drill-banner" role="status"><strong>Simulation / training only</strong><span>Fictional Mars mission · day 24. Software workflow drill; no medical score or outcome.</span></div>}
      <section className="crew-guidance" aria-labelledby="crew-emergency-heading"><EmergencyGuidance headingId="crew-emergency-heading" /></section>
      <section className="crew-optional" aria-labelledby="crew-optional-heading"><h2 id="crew-optional-heading">When the immediate response is underway</h2><p>Only document if appropriate and without delaying the crew’s approved response. This prototype keeps records on this device; use fictional identifiers and synthetic information for demonstrations.</p><div className="crew-actions"><button className="button primary" onClick={() => begin(false)}>Document an incident (optional)</button><button className="button secondary" onClick={() => begin(true)}>Start Crew Emergency Drill</button></div></section>
      {error && <p className="crew-error" role="alert">{error}</p>}{message && <p className="crew-feedback" role="status">{message}</p>}
      {stage === "briefing" && draft && <section className="crew-drill-brief"><h2 ref={stageHeading} tabIndex={-1}>Crew Emergency Drill</h2><p className="simulation-label">Simulation / training only · synthetic incident and clock</p><p>{draft.circumstances}</p><ol><li>Read the approved-procedure and trained-personnel guidance above.</li><li>Recognize that ordinary monitoring flags do not assess this concern.</li><li>Record only supplied observations, keeping missing information unknown.</li><li>Prepare a local handoff. No contact, treatment or recovery is simulated.</li></ol><button className="button primary" onClick={() => setStage("document")}>Continue drill: record observations</button></section>}
      {stage === "document" && draft && <form className="crew-document" autoComplete="off" onSubmit={submit} aria-labelledby="crew-document-heading"><h2 id="crew-document-heading" ref={stageHeading} tabIndex={-1}>{drill ? "Drill: record observations" : "Optional incident record"}</h2><p className={drill ? "simulation-label" : "small-note"}>{drill ? "Simulation / training only. All incident entries remain synthetic, including your edits." : "User-entered information, not independently verified. Leave unknown observations blank."}</p><p className="crew-local-notice">No automated contact. This is a same-device record, not a synchronized crew system. This prototype does not provide production-grade medical data security. Exported files may contain every field and any history you explicitly include.</p>
        <div className="crew-form-grid"><label className="field crew-field"><span id="crew-identifier-label">Fictional crewmember identifier</span><input aria-labelledby="crew-identifier-label" id="crew-identifier" name="crewmember" spellCheck={false} aria-invalid={Boolean(error && !draft.crewmember.trim())} aria-describedby={error && !draft.crewmember.trim() ? "crew-identifier-error" : undefined} required maxLength={100} autoComplete="off" value={draft.crewmember} onChange={event => change({ ...draft, crewmember: event.target.value })} />{error && !draft.crewmember.trim() && <small id="crew-identifier-error">Enter a fictional crewmember identifier.</small>}</label><label className="field crew-field"><span>Incident timestamp (device local time)</span><input name="incidentAt" type="datetime-local" value={localTime(draft.incidentAt)} onChange={event => change({ ...draft, incidentAt: utcTime(event.target.value) })} /><small>Blank means unknown. Export uses UTC. Drill times use a fictional clock.</small></label></div>
        <TextField label="Mission context" value={draft.missionContext} onChange={value => change({ ...draft, missionContext: value })} />
        <TextField label="Reported or directly observed circumstances" value={draft.circumstances} onChange={value => change({ ...draft, circumstances: value })} />
        <label className="field crew-field"><span id="crew-circumstance-source">Circumstances source</span><select name="circumstancesSource" aria-labelledby="crew-circumstance-source" value={draft.circumstancesSource} onChange={event => change({ ...draft, circumstancesSource: event.target.value as CrewIncident["circumstancesSource"] })}>{Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <fieldset className="crew-fieldset"><legend>Current measured observations, if available</legend><TextField label="Measured observations" help="Include value, units and method only when available. No device is connected and no reading is verified. Historical readings are not current measurements." value={draft.measurements.text} onChange={value => change({ ...draft, measurements: { ...draft.measurements, text: value } })} /><div className="crew-form-grid"><label className="field crew-field"><span>Observation timestamp (device local time)</span><input name="observationAt" type="datetime-local" value={localTime(draft.measurements.observedAt)} onChange={event => change({ ...draft, measurements: { ...draft.measurements, observedAt: utcTime(event.target.value) } })} /></label><label className="field crew-field"><span id="crew-measurement-source">Measurement source</span><select name="measurementSource" aria-labelledby="crew-measurement-source" value={draft.measurements.source} onChange={event => change({ ...draft, measurements: { ...draft.measurements, source: event.target.value as CrewIncident["measurements"]["source"] } })}>{Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div></fieldset>
        <TextField label="Important missing information" value={draft.missingInformation} onChange={value => change({ ...draft, missingInformation: value })} />
        <TextField label="Actions you report having taken" help="Record what happened. This field provides no treatment instructions and verifies no action." value={draft.actions} onChange={value => change({ ...draft, actions: value })} />
        <fieldset className="crew-fieldset"><legend>Contact with designated medical personnel</legend><label className="field crew-field"><span id="crew-contact-source">User-reported contact status</span><select name="contactStatus" aria-labelledby="crew-contact-source" value={draft.contact.status} onChange={event => change({ ...draft, contact: { ...draft.contact, status: event.target.value as CrewIncident["contact"]["status"] } })}>{Object.entries(contactLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><p>Even “contact confirmed” is only your report. OrbitCare has not contacted anyone or verified a response.</p><label className="field crew-field"><span>Contact report timestamp (device local time)</span><input name="contactReportedAt" type="datetime-local" value={localTime(draft.contact.reportedAt)} onChange={event => change({ ...draft, contact: { ...draft.contact, reportedAt: utcTime(event.target.value) } })} /></label><TextField label="Contact details reported by you" value={draft.contact.detail} onChange={value => change({ ...draft, contact: { ...draft.contact, detail: value } })} /></fieldset>
        <details className="crew-history-choice"><summary>Optional historical monitoring context</summary><p>{workspace.name}, selected mission day {day}. This is historical context from the active workspace, never current incident measurements. Only the selected day’s record and review events through that day are copied; later data stays excluded.</p><label className="crew-checkbox"><input name="includeHistoricalContext" type="checkbox" checked={draft.history !== null} onChange={event => change({ ...draft, history: event.target.checked ? historicalSnapshot(workspace, day, new Date().toISOString()) : null })} /><span>Include history: I confirm this workspace belongs to the same fictional crewmember.</span></label>{draft.history && <p>Snapshot included through day {draft.history.throughDay}; sources and original timestamps are retained. OrbitCare cannot verify the identity match.</p>}</details>
        <TextField label="Additional notes" value={draft.notes} onChange={value => change({ ...draft, notes: value })} />
        <p className="small-note">{dirty ? "Unsaved changes. Save locally or export the handoff before leaving." : "Records are saved only when you choose a save or prepare action."}</p><div className="crew-actions"><button className="button secondary" type="button" disabled={!ready || busy} onClick={() => void save(false)}>Save incident locally</button><button className="button primary" type="submit" disabled={!ready || busy}><FileText size={17} aria-hidden="true" />{busy ? "Preparing…" : "Prepare handoff"}</button></div>
      </form>}
      {stage === "handoff" && prepared && <div className="crew-report-actions"><h2 ref={stageHeading} tabIndex={-1}>{drill ? "Drill: handoff prepared" : "Handoff prepared"}</h2><p>{drill ? "Simulation / training only. " : ""}Review the summary below. Exporting or printing notifies no one. Downloaded copies remain outside OrbitCare’s control.</p><div className="crew-actions"><button className="button secondary" onClick={() => setStage("document")}>Edit incident</button><button className="button secondary" onClick={() => download(exportIncident(prepared), "json", "application/json")}><ArrowDownToLine size={17} aria-hidden="true" />Export incident JSON</button><button className="button secondary" onClick={() => download(handoffText(prepared), "txt", "text/plain;charset=utf-8")}>Download handoff text</button><button className="button primary" onClick={() => window.print()}><Printer size={17} aria-hidden="true" />Print / Save as PDF</button></div></div>}
      <details className="crew-records"><summary>Show local incident records ({incidents.length})</summary><p>Visible to anyone using this browser profile on this device. No cross-device sync or access control is provided.</p>{incidents.length ? <ul>{incidents.map(record => <li key={record.id}><button className="text-button" onClick={() => openSaved(record)}>{record.mode === "synthetic-drill" ? "Simulation / training only · " : "User-entered · "}{record.crewmember} · {record.savedAt || "unknown save time"}</button><button className="text-button" disabled={busy || blocked} onClick={() => void remove(record.id)}>Delete local incident</button></li>)}</ul> : <p>No saved incidents. Unknown information is never filled from monitoring data.</p>}<label className="field crew-field"><span>Import incident JSON</span><input name="incidentImport" type="file" autoComplete="off" accept=".json,application/json" disabled={!ready || busy} onChange={event => void importFile(event)} /></label><p>Separate from monitoring-workspace imports. Imported source and contact statements remain unverified.</p></details>
    </div>
    {stage === "handoff" && prepared && <section className="crew-handoff" aria-label="Prepared incident handoff"><h2>Incident handoff</h2><div className="handoff-overview"><p className="simulation-label">{prepared.mode === "synthetic-drill" ? "Simulation / training only · synthetic record" : "User-entered record · not independently verified"}</p><h3>{prepared.crewmember}</h3><dl><div><dt>Incident time (UTC)</dt><dd>{prepared.incidentAt || "Unknown / not recorded"}</dd></div><div><dt>Current measured observations</dt><dd>{prepared.measurements.text || "Unknown / not recorded"}</dd></div><div><dt>Contact · user report only</dt><dd>{contactLabels[prepared.contact.status]}</dd></div><div><dt>Historical monitoring context</dt><dd>{prepared.history ? `Explicit snapshot through mission day ${prepared.history.throughDay}; never current incident measurements.` : "Not selected; no historical readings included."}</dd></div></dl><p>No diagnosis, care prescription or notification. Use actual approved mission procedures and trained personnel.</p></div><pre className="handoff-copy">{handoffText(prepared)}</pre></section>}
  </div>;
}
