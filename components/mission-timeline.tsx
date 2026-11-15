"use client";
import { ChevronLeft, ChevronRight, FileCheck2, Pause, Play } from "lucide-react";
import { analyze } from "@/lib/analysis";
import type { Workspace } from "@/lib/types";
export default function MissionTimeline({ workspace, day, playing, selectDay, onReplay }: { workspace: Workspace; day: number; playing: boolean; selectDay: (day: number) => void; onReplay: () => void }) {
  const first = Math.max(1, Math.min(day - 89, workspace.currentDay - 179));
  const days = Array.from({ length: Math.min(workspace.currentDay, 180) }, (_, index) => {
    const d = first + index;
    const future = d > day;
    const values = future ? [] : analyze(workspace, d);
    const review = values.some(result => result.status === "review");
    const missing = values.some(result => ["missing", "not-comparable"].includes(result.status));
    const change = values.some(result => result.status === "change");
    return { day: d, future, review, missing, reference: d <= 14, change, events: workspace.reviews.filter(event => event.day === d && event.day <= day).length };
  });
  const selected = days.find(item => item.day === day)!;
  return <section className="timeline surface" aria-labelledby="timeline-heading"><div className="surface-heading"><div><span className="section-kicker">The monitoring-to-review record</span><h2 id="timeline-heading" tabIndex={-1}>Follow the mission</h2><p>Select a day to see only what was known then.</p></div><div className="timeline-controls"><button className="icon-button" aria-label="Previous mission day" disabled={day <= 1} onClick={() => selectDay(day - 1)}><ChevronLeft size={19} /></button><button className="play-button" onClick={onReplay}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? "Pause" : "Replay"}</button><button className="icon-button" aria-label="Next mission day" disabled={day >= workspace.currentDay} onClick={() => selectDay(day + 1)}><ChevronRight size={19} /></button></div></div>
    <div className="mission-phases" aria-hidden="true"><span>01–14 · Personal reference</span><span>15+ · Observe and review</span></div>
    {workspace.currentDay > 180 && <p className="small-note timeline-window">Showing days {first}–{first + 179}. Use the slider to inspect any mission day; plots show up to 180 days.</p>}
    <div className="day-grid">{days.map(item => <button key={item.day} className={`${item.day === day ? "selected" : ""} ${item.reference ? "reference-day" : ""} ${item.review ? "flagged-day" : ""} ${item.missing ? "gap-day" : ""} ${item.change ? "change-day" : ""} ${item.future ? "future-day" : ""}`} data-state={item.future ? "future" : item.review ? "review" : item.missing ? "missing" : item.change ? "change" : item.reference ? "reference" : "steady"} aria-pressed={day === item.day} aria-label={`Mission day ${item.day}${item.future ? ", not yet displayed" : item.reference ? ", reference period" : item.review ? ", review suggested" : item.missing ? ", incomplete data" : ""}`} title={`${item.events ? `${item.events} recorded review actions. ` : ""}${item.change ? "Change observed." : ""}`} onClick={() => selectDay(item.day)}><span className="day-number">{String(item.day).padStart(2, "0")}</span><span className="day-state-mark" aria-hidden="true">{item.missing ? "—" : item.review ? "!" : item.change ? "·" : item.reference ? "=" : "·"}</span>{item.events > 0 && <FileCheck2 className="day-review-event" size={12} aria-hidden="true" />}</button>)}</div>
    <div className="timeline-selection"><strong>Day {String(day).padStart(3, "0")}</strong><span>{selected.reference ? "Reference period" : selected.review ? "Sustained change · review suggested" : selected.missing ? "Missing / non-comparable information" : selected.change ? "Change observed · persistence not yet met" : "No sustained deviation detected"}</span><span>{selected.events} recorded review{selected.events === 1 ? "" : "s"}</span></div>
    <label className="timeline-slider">Selected mission day <strong>{day}</strong><input aria-label="Selected mission day" type="range" min={1} max={workspace.currentDay} value={day} onChange={event => selectDay(Number(event.target.value))} /></label><div className="timeline-key"><span><i className="reference-swatch" />Reference =</span><span><i className="amber-dot" />Review suggested !</span><span><i className="gap-dot" />Missing —</span><span><FileCheck2 size={13} />Recorded action</span></div>
  </section>;
}
