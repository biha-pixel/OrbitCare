"use client";
import { useRef } from "react";
import ResearchConnections from "./research-connections";
import { Activity, ChevronRight, ClipboardPlus, FileCheck2, Info } from "lucide-react";
import { formatValue, METRICS } from "@/lib/analysis";
import type { Indicator, Result, Review, Workspace } from "@/lib/types";
import { SCENARIOS } from "@/data/scenarios";
import MetricPlot from "./metric-plot";
import Explanation from "./explanation";
import ChangeBrief from "./change-brief";
import ScenarioPicker from "./scenario-picker";
import MissionTimeline from "./mission-timeline";

type Props = {
  fixedFixture: boolean; onDemo: () => void; workspace: Workspace; day: number; indicator: Indicator; results: Result[]; loaded: boolean; playing: boolean;
  selectDay: (day: number) => void; selectIndicator: (indicator: Indicator) => void;
  selectWorkspace: (id: string) => void; onCheckIn: () => void; onReview: (review: Review) => void;
  investigating: boolean; onInvestigating: (open: boolean) => void; onResearch: () => void;
  onReplay: () => void; onData: () => void; onExplorer: () => void; onUrgent: () => void;
};
export default function MonitorView({ fixedFixture, onDemo, workspace, day, indicator, results, loaded, playing, selectDay, selectIndicator, selectWorkspace, onCheckIn, onReview, onReplay, onData, onExplorer, onUrgent, investigating, onInvestigating, onResearch }: Props) {
  const investigation = useRef<HTMLDetailsElement>(null);
  const selected = results.find(result => result.indicator === indicator)!;
  const reviewCount = results.filter(result => result.status === "review").length;
  const incomplete = results.filter(result => ["missing", "not-comparable", "insufficient"].includes(result.status)).length;
  const changed = results.some(result => result.status === "change");
  const row = workspace.checkIns.find(item => item.day === day);
  const scenario = workspace.kind === "scenario" ? SCENARIOS.find(item => item.id === workspace.scenario) : undefined;
  const reviews = workspace.reviews.filter(review => review.day <= day);
  function inspect(next: Indicator, replay = false) {
    onInvestigating(true);
    if (investigation.current) investigation.current.open = true;
    selectIndicator(next);
    requestAnimationFrame(() => {
      const heading = document.getElementById(replay ? "timeline-heading" : "explanation-heading");
      heading?.focus({ preventScroll: true });
      heading?.closest(replay ? ".timeline" : ".explanation")?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  }
  const headline = reviewCount ? `${reviewCount} indicators suggest a closer look.` : incomplete ? "An incomplete picture needs context." : changed ? "A change is emerging in the record." : day <= 14 ? "Establishing a personal reference." : "Within the current comparison rules.";
  return <>
    <div className="page-heading"><div><div className="heading-context"><span className="crew-chip">C01</span><span className="crew-name">Crewmember 01</span><span className="simulation-tag">{workspace.kind === "scenario" ? "Synthetic simulation" : workspace.kind === "imported" ? "Imported test workspace" : "User-entered test workspace"}</span></div><h1>Mission health review</h1><p className="mission-purpose">Spot personal changes in space. Review with context, even offline.</p><p className="mission-context"><span>{workspace.name}</span><span>Personal reference: days 01–14</span></p></div><div className="page-actions"><div className="mission-clock"><span>Mission day</span><strong>{String(day).padStart(3, "0")}</strong><small>of {workspace.currentDay}</small></div><button className="button secondary" disabled={!loaded || fixedFixture} onClick={onCheckIn}><ClipboardPlus size={18} />Record check-in</button></div></div>
    <button className="workspace-demo-link text-button" onClick={onDemo}>Open guided mission demo<ChevronRight size={15} aria-hidden="true" /></button>
    {fixedFixture && <p className="small-note fixture-note">The guided mission keeps its synthetic check-ins fixed. Reviews remain editable. Choose another scenario or create a test workspace to enter measurements.</p>}
    <ScenarioPicker active={workspace.id} loaded={loaded} onSelect={selectWorkspace} />
    <div key={`brief-${workspace.id}-${day}`} className="finding-transition"><ChangeBrief results={results} day={day} headline={headline} onInspect={inspect} onInvestigate={next => inspect(next, true)} /></div>
    <div className="monitor-pathways"><button className="mobile-check-in" disabled={!loaded || fixedFixture} onClick={onCheckIn}><ClipboardPlus size={17} aria-hidden="true" /><span>Record check-in</span><ChevronRight size={17} aria-hidden="true" /></button><button onClick={onExplorer}><Activity size={17} aria-hidden="true" /><span>Explore the human context<small>Body systems, measurements and NASA evidence</small></span><ChevronRight size={17} aria-hidden="true" /></button><button onClick={onUrgent}><Info size={17} aria-hidden="true" /><span>Serious symptoms?<small>Use approved procedures now. Don’t wait for a trend.</small></span><ChevronRight size={17} aria-hidden="true" /></button></div>
    <details ref={investigation} className="investigation" open={investigating} onToggle={event => onInvestigating(event.currentTarget.open)}><summary>Mission Decision Replay<span>Timeline, calculation & review</span></summary>
    <p className="scenario-description">{scenario?.description ?? `Test workspace: ${workspace.name}. NASA observations remain separate.`}{reviewCount > 0 && incomplete > 0 ? ` ${incomplete} indicator(s) also have incomplete data.` : ""}</p>
    <MissionTimeline workspace={workspace} day={day} indicator={indicator} playing={playing} selectDay={selectDay} onReplay={onReplay} />
    <div className="indicator-selector" role="group" aria-label="Investigate an indicator">{results.map(result => <button key={result.indicator} aria-pressed={indicator === result.indicator} onClick={() => selectIndicator(result.indicator)}>{METRICS[result.indicator].name}</button>)}</div>
    <div className="monitor-grid" onFocusCapture={() => { if (playing) selectDay(day); }} onPointerDownCapture={() => { if (playing) selectDay(day); }}><div className="record-column">
      <section className="surface record-surface" aria-labelledby="record-heading"><div className="surface-heading"><div><h2 id="record-heading">Your indicators, in perspective</h2><p>Original units. One fixed reference. No hidden score.</p></div><span className="record-symbol"><Activity size={20} /></span></div><div className="chart-legend"><span><i className="reference-swatch" />Reference days 1–14</span><span><i className="median-swatch" />Personal median</span><span><i className="rule-swatch" />Prototype change boundary</span></div><MetricPlot workspace={workspace} day={day} result={selected} selected onSelect={inspect} /><div className="record-footnote"><Info size={14} /><span>Select an indicator to inspect its explanation. Future observations are hidden when replaying an earlier day. Gaps are never filled with zero.</span></div></section>
      <section className="exercise-context"><div className="exercise-icon"><Activity size={20} /></div><div><h3>Exercise adds context</h3><p>{row?.exercise === null || row?.exercise === undefined ? "No exercise duration recorded for this day." : `${row.exercise} minutes recorded on day ${day}. Duration alone does not measure fitness or establish an exercise prescription.`}</p></div><strong>{formatValue(row?.exercise ?? null, "exercise")}<span>min</span></strong></section>
      <details className="data-details surface"><summary>Inspect the monitoring data table</summary><div className="table-scroll"><table><caption>{workspace.name}; observations available through mission day {day}</caption><thead><tr><th scope="col">Day</th><th scope="col">Heart rate (bpm)</th><th scope="col">Sleep (h)</th><th scope="col">Fatigue (1–5)</th><th scope="col">Exercise (min)</th><th scope="col">Origin / quality</th></tr></thead><tbody>{workspace.checkIns.filter(item => item.day <= day).map(item => <tr key={item.id}><th scope="row">{item.day}</th><td>{formatValue(item.heartRate, "heartRate")}</td><td>{formatValue(item.sleep, "sleep")}</td><td>{formatValue(item.fatigue, "fatigue")}</td><td>{formatValue(item.exercise, "exercise")}</td><td>{item.origin === "synthetic" ? "Synthetic" : "User test entry"}{!item.comparable ? "; heart rate not comparable" : ""}</td></tr>)}</tbody></table></div></details>
    </div><div className="explanation-column"><Explanation key={`${workspace.id}-${day}-${indicator}`} workspace={workspace} day={day} result={selected} onReview={onReview} onRecent={() => { document.getElementById("timeline-heading")?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); document.getElementById("timeline-heading")?.focus({ preventScroll: true }); }} /><section className="history-panel"><h3><FileCheck2 size={16} />Review history<span>{reviews.length}</span></h3>{reviews.length === 0 ? <p>No actions recorded through day {day}. Inspect an indicator to record a review.</p> : <ol>{reviews.slice().reverse().slice(0, 8).map(review => <li key={review.id} className="review-event motion-enter"><span className="history-day">Day {review.day} · {METRICS[review.indicator].short}</span><strong>{review.action}</strong>{review.note && <p>{review.note}</p>}<time dateTime={review.recordedAt}>{new Date(review.recordedAt).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })} UTC</time></li>)}</ol>}<button className="text-button" onClick={onData}>Export the complete local record <ChevronRight size={14} /></button></section></div></div>
    </details>
    <ResearchConnections onResearch={onResearch} />
    <div className="visually-hidden" role="status" aria-live="polite">Mission day {day}. {reviewCount} indicators suggest review. {incomplete} indicators have insufficient or missing information.</div>
  </>;
}
