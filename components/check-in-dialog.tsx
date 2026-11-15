"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, ClipboardPlus, Save } from "lucide-react";
import { checkInSchema } from "@/lib/validation";
import type { CheckIn, Workspace } from "@/lib/types";
import MeasurementGuide from "./measurement-guide";

export default function CheckInDialog({ workspace, initialDay, onClose, onSave, onUrgent }: { workspace: Workspace; initialDay: number; onClose: () => void; onSave: (row: CheckIn) => void; onUrgent: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  function formFor(day: number) {
    const row = workspace.checkIns.find(item => item.day === day);
    return { heartRate: row?.heartRate?.toString() ?? "", sleep: row?.sleep?.toString() ?? "", fatigue: row?.fatigue?.toString() ?? "", exercise: row?.exercise?.toString() ?? "", comparable: row?.comparable ?? true, note: row?.note ?? "" };
  }
  const [day, setDay] = useState(initialDay);
  const [form, setForm] = useState(() => formFor(initialDay));
  const [replace, setReplace] = useState(false);
  const [error, setError] = useState("");
  const existing = workspace.checkIns.find(item => item.day === day);
  useEffect(() => { dialog.current?.showModal(); }, []);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (existing && !replace) { setError("Confirm replacement of the existing check-in before saving."); return; }
    const numeric = (value: string) => value.trim() === "" ? null : Number(value);
    const parsed = checkInSchema.safeParse({ id: existing?.id ?? crypto.randomUUID(), day, heartRate: numeric(form.heartRate), sleep: numeric(form.sleep), fatigue: numeric(form.fatigue), exercise: numeric(form.exercise), comparable: form.comparable, note: form.note, origin: "user-entry", recordedAt: new Date().toISOString() });
    if (!parsed.success) { setError(parsed.error.issues.map(issue => `${issue.path.join(" ")}: ${issue.message}`).join(". ")); return; }
    onSave(parsed.data); onClose();
  }
  return <dialog ref={dialog} className="entry-dialog" onCancel={onClose} aria-labelledby="checkin-heading"><form onSubmit={submit}>
    <div className="dialog-heading"><span className="dialog-icon"><ClipboardPlus size={22} /></span><button className="icon-button" type="button" onClick={onClose} aria-label="Close check-in"><X size={21} /></button></div>
    <h2 id="checkin-heading">Record a check-in</h2><p className="muted">Test measurements stay on this device. Blank fields are missing readings; zero sleep or exercise is valid.</p>
    <button type="button" className="checkin-urgent-link text-button" onClick={onUrgent}>Serious symptoms? Open urgent pathway</button>
    <MeasurementGuide />
    <label className="field day-field">Mission day<input type="number" min="1" max="9999" required value={day} onChange={event => { const next = Number(event.target.value); setDay(next); setForm(formFor(next)); setReplace(false); }} /></label>
    <div className="form-grid">
      <label className="field">Resting heart rate <span>bpm · input bounds 20–250</span><input name="heartRate" inputMode="decimal" type="number" min="20" max="250" step="0.1" value={form.heartRate} onChange={event => setForm({ ...form, heartRate: event.target.value })} /></label>
      <label className="field">Sleep duration <span>hours · 0–24</span><input name="sleep" inputMode="decimal" type="number" min="0" max="24" step="0.1" value={form.sleep} onChange={event => setForm({ ...form, sleep: event.target.value })} /></label>
      <label className="field">Self-reported fatigue <span>Illustrative ordinal scale</span><select name="fatigue" value={form.fatigue} onChange={event => setForm({ ...form, fatigue: event.target.value })}><option value="">Not recorded</option><option value="1">1 — No fatigue</option><option value="2">2 — Slight</option><option value="3">3 — Moderate</option><option value="4">4 — High</option><option value="5">5 — Very high</option></select></label>
      <label className="field">Exercise duration <span>minutes · context only</span><input name="exercise" inputMode="numeric" type="number" min="0" max="1440" step="1" value={form.exercise} onChange={event => setForm({ ...form, exercise: event.target.value })} /></label>
    </div>
    <label className="checkbox-field"><input type="checkbox" checked={form.comparable} onChange={event => setForm({ ...form, comparable: event.target.checked })} /><span>Heart rate taken under comparable resting conditions<small>Uncheck to retain the value but exclude it from heart-rate comparisons.</small></span></label>
    <label className="field">Context or measurement note <span>Optional · no private medical information needed</span><textarea name="note" maxLength={1000} rows={3} value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} /></label>
    {existing && <label className="checkbox-field replace-notice"><input type="checkbox" checked={replace} onChange={event => setReplace(event.target.checked)} /><span>Replace the existing check-in for mission day {day}.<small>Historical comparisons will be recalculated. Review history is retained.</small></span></label>}
    {day <= workspace.referenceEnd && <p className="small-note">This is inside the fixed reference period. Editing it explicitly changes reference calculations; later readings never move it automatically.</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="dialog-footer"><span className="small-note">Input bounds are not clinical limits.</span><button className="button primary" type="submit"><Save size={16} />Save check-in</button></div>
  </form></dialog>;
}
