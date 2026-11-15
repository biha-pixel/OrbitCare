"use client";
import { useState } from "react";
import { ArrowUpRight, BookOpen, Check, ChevronRight, CircleHelp, FileCheck2 } from "lucide-react";
import { METRICS, STATUS_LABELS, formatValue } from "@/lib/analysis";
import { evidence } from "@/data/evidence";
import type { Result, Review, Workspace } from "@/lib/types";

export default function Explanation({ workspace, day, result, onReview }: { workspace: Workspace; day: number; result: Result; onReview: (review: Review) => void }) {
  const [action, setAction] = useState<Review["action"]>("Verify measurement");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const metric = METRICS[result.indicator];
  const source = evidence.find(item => item.id === (result.indicator === "heartRate" ? "physiology" : "sleep"))!;
  const reviewCount = workspace.reviews.filter(review => review.day === day && review.indicator === result.indicator).length;
  const flagged = result.status === "review" || result.status === "change";
  const reading = workspace.checkIns.find(item => item.day === day);
  const rule = result.indicator === "heartRate" ? `An absolute change of at least ${formatValue(result.reference.threshold, "heartRate")} bpm from the reference median.` : result.indicator === "sleep" ? `A reduction of at least ${formatValue(result.reference.threshold, "sleep")} hours below the reference median.` : "An increase of at least 2 categories above the reference category.";
  const difference = result.delta === null ? "Unavailable" : `${result.delta > 0 ? "+" : ""}${formatValue(result.delta, result.indicator)} ${result.indicator === "fatigue" ? "categories" : metric.unit}`;
  const explanations = {
    review: "A sustained departure from your reference. A reason to review, not a diagnosis.",
    change: "A change is visible. The three-day review rule has not yet been met.",
    missing: "There is no reading to compare today. Missing information cannot establish a reassuring pattern.",
    "not-comparable": "This heart-rate reading was marked non-comparable. It is retained and excluded from analysis.",
    insufficient: "At least 10 valid reference readings and a completed reference period are needed before comparison.",
    reference: "These days establish the fixed comparison period. Review rules start after day 14.",
    steady: "No sustained deviation meets this prototype rule today. This does not establish health or safety.",
  };
  return <aside className="explanation surface" aria-labelledby="explanation-heading">
    <div className="explanation-top"><span><CircleHelp size={17} />Understand this reading</span><span className="mono">D{String(day).padStart(3, "0")}</span></div>
    <div className="explanation-body"><h2 id="explanation-heading">{metric.name}</h2><span className={`status-pill ${flagged ? "amber" : "neutral"}`}>{STATUS_LABELS[result.status]}</span><p className="explanation-lead">{explanations[result.status]}</p>
      <dl className="comparison"><div><dt>Personal reference</dt><dd>{formatValue(result.reference.median, result.indicator)} <span>{metric.unit}</span></dd></div><div><dt>Selected reading</dt><dd>{formatValue(result.value, result.indicator)} <span>{metric.unit}</span></dd></div><div className={flagged ? "comparison-change" : ""}><dt>Change from reference</dt><dd>{difference}</dd></div></dl>
      <div className="persistence"><div><span>Consecutive changed days</span><strong>{result.streak} <span>/ 3 required</span></strong></div><div className="streak-marks" aria-hidden="true">{[1, 2, 3].map(number => <i key={number} className={result.streak >= number ? "filled" : ""} />)}</div><p>Missing or non-comparable readings break the sequence.</p></div>
      <details className="rule-details" open><summary>How this flag is calculated</summary><p>{rule} Three consecutive days meeting the rule suggest review.</p><p className="assumption-label">Prototype engineering assumption · not a NASA or clinical threshold</p><p className="rule-id">Rule {result.ruleId}</p></details>
      <details className="evidence-details"><summary><BookOpen size={15} />Research context</summary><h3>{source.title}</h3><p>{source.text}</p><a href={source.url} target="_blank" rel="noreferrer">{source.source}<ArrowUpRight size={14} /></a><p>{source.limitation}</p></details>
      <details className="evidence-details"><summary>Reference quality and uncertainty</summary><p>{result.reference.count} valid observations in fixed days {workspace.referenceStart}–{workspace.referenceEnd}; minimum 10. Later data never silently updates this reference.</p><p>{result.indicator === "fatigue" ? "Fatigue uses the lower median category, not a mean, percentage change, or Gaussian score." : `Robust variation: ${formatValue(result.reference.variation, result.indicator)} ${metric.unit}. This describes reference variability, not device accuracy or a confidence interval.`}</p><p>Changed measurement conditions, mission adaptation, and other factors may affect comparison. False positive and false negative rates are unknown.</p></details>
      <details className="evidence-details"><summary>Reading origin and recorded context</summary><p>{reading ? reading.origin === "synthetic" ? "Synthetic scenario measurement; not an astronaut medical record." : "User-entered test measurement; accuracy is not verified." : "No check-in exists for this day."}</p>{reading && <p>Heart-rate measurement {reading.comparable ? "marked comparable" : "marked non-comparable"}. Sleep and fatigue retain their separate comparison rules.</p>}<p>{reading?.note || "No additional context recorded."}</p></details>
      <section className="review-form" aria-labelledby="review-heading"><h3 id="review-heading"><FileCheck2 size={17} />Record a review action</h3><p>This is a local record. It does not contact medical support or clear the calculated flag.</p><form onSubmit={event => { event.preventDefault(); onReview({ id: crypto.randomUUID(), day, indicator: result.indicator, action, note, recordedAt: new Date().toISOString() }); setNote(""); setSaved(true); }}><label className="field compact">Action<select value={action} onChange={event => { setAction(event.target.value as Review["action"]); setSaved(false); }}><option>Verify measurement</option><option>Add context</option><option>Request medical review</option></select></label><label className="field compact">Review note <span>Optional</span><textarea rows={2} maxLength={1000} value={note} onChange={event => { setNote(event.target.value); setSaved(false); }} placeholder="What needs checking or following up?" /></label><button type="submit" className="button secondary full">{saved ? <Check size={16} /> : <ChevronRight size={16} />}{saved ? "Review recorded" : "Record action"}</button></form>{reviewCount > 0 && <p className="review-count">{reviewCount} action{reviewCount === 1 ? "" : "s"} recorded for this indicator and day.</p>}</section>
    </div>
  </aside>;
}
