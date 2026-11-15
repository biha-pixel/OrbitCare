"use client";
import { Check, FlaskConical } from "lucide-react";
import { makeScenario, SCENARIOS } from "@/data/scenarios";
const descriptions = { stable: "Ordinary personal variation", drift: "Several days of change", missing: "Gaps need interpretation", recovery: "A return toward reference" };
const previews = Object.fromEntries(SCENARIOS.map(scenario => {
  let drawing = ""; let connected = false;
  for (const row of makeScenario(scenario.id).checkIns) {
    if (row.heartRate === null || !row.comparable) { connected = false; continue; }
    drawing += `${connected ? "L" : "M"}${(row.day - 1) * 2.4},${29 - (row.heartRate - 57) * 1.4} `;
    connected = true;
  }
  return [scenario.id, drawing];
}));
export default function ScenarioPicker({ active, loaded, onSelect }: { active: string; loaded: boolean; onSelect: (id: string) => void }) {
  return <section className="scenario-lab" aria-label="Reproducible mission scenarios"><div className="scenario-lab-heading"><span><FlaskConical size={16} />Explore the same mission, four ways</span><span>Synthetic measurements</span></div><div className="scenario-options">{SCENARIOS.map(scenario => <button key={scenario.id} aria-label={scenario.label} aria-pressed={active === scenario.id} disabled={!loaded} onClick={() => onSelect(scenario.id)}><svg className={`scenario-spark spark-${scenario.id}`} viewBox="0 0 66 34" aria-hidden="true"><path d={previews[scenario.id]} fill="none" stroke="currentColor" strokeWidth="1.8" /></svg><span><strong>{scenario.label}</strong><small>{descriptions[scenario.id]}</small></span>{active === scenario.id && <Check size={16} className="scenario-check" />}</button>)}</div></section>;
}
