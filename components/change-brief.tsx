"use client";
import { ArrowDown, ArrowRight, ArrowUp, CircleAlert, Minus, ScanLine } from "lucide-react";
import { formatValue, METRICS, STATUS_LABELS } from "@/lib/analysis";
import type { Indicator, Result } from "@/lib/types";

export default function ChangeBrief({ results, day, headline, onInspect }: { results: Result[]; day: number; headline: string; onInspect: (indicator: Indicator) => void }) {
  const flagged = results.filter(result => result.status === "review");
  const uncertain = results.some(result => ["missing", "not-comparable", "insufficient"].includes(result.status));
  const primary = flagged[0] ?? results.find(result => result.status === "change") ?? results[0];
  return <section className={`change-brief ${flagged.length ? "brief-review" : uncertain ? "brief-incomplete" : "brief-steady"}`} aria-labelledby="change-heading">
    <div className="brief-message"><div className="brief-status"><span className="brief-status-mark"><CircleAlert size={15} /></span>{flagged.length ? "Review suggested" : uncertain ? "Data quality needs attention" : day <= 14 ? "Building your reference" : "Personal comparison"}<span>Day {String(day).padStart(3, "0")}</span></div><h2 id="change-heading">{headline}</h2><p>{flagged.length ? "A sustained change from your own reference. Understand the pattern before recording a review." : uncertain ? "The record has gaps or insufficient reference data. Missing information cannot establish a reassuring pattern." : "Inspect the observations and their context. This comparison cannot establish health or safety."}</p><button className="brief-action" onClick={() => onInspect(primary.indicator)}><ScanLine size={17} />{flagged.length ? "Investigate the finding" : "Inspect this day"}<ArrowRight size={17} /></button></div>
    <div className="brief-comparisons" aria-label="Changes from personal reference">{results.map(result => {
      const unavailable = !result.reference.sufficient || result.status === "reference" || result.delta === null || result.status === "not-comparable";
      const changed = result.status === "review" || result.status === "change";
      const DeltaIcon = unavailable || result.delta === 0 ? Minus : result.delta! > 0 ? ArrowUp : ArrowDown;
      return <button key={result.indicator} className={`brief-metric ${changed ? "has-change" : ""}`} onClick={() => onInspect(result.indicator)} aria-label={`Inspect ${METRICS[result.indicator].name}: ${STATUS_LABELS[result.status]}`}><span className="brief-metric-label">{METRICS[result.indicator].short}</span><strong><DeltaIcon size={20} />{unavailable ? "—" : formatValue(Math.abs(result.delta!), result.indicator)}<small>{result.indicator === "fatigue" ? "categories" : METRICS[result.indicator].unit}</small></strong><span className="brief-metric-context">{unavailable ? "Comparison unavailable" : `from ${formatValue(result.reference.median, result.indicator)} ${result.indicator === "fatigue" ? "/ 5" : METRICS[result.indicator].unit} reference`}</span><span className="brief-metric-state">{STATUS_LABELS[result.status]}<ArrowRight size={13} /></span></button>;
    })}<p className="brief-caveat">Prototype rules · no diagnosis or clinical safety conclusion</p></div>
  </section>;
}
