"use client";
import { SCENARIOS } from "@/data/scenarios";
export default function ScenarioPicker({ active, loaded, onSelect }: { active: string; loaded: boolean; onSelect: (id: string) => void }) {
  return <section className="scenario-lab" aria-label="Reproducible mission scenarios"><div className="scenario-lab-heading"><span>Mission scenario</span><span>Synthetic measurements</span></div><div className="scenario-options">{SCENARIOS.map(scenario => <button key={scenario.id} aria-label={scenario.label} aria-pressed={active === scenario.id} disabled={!loaded} onClick={() => onSelect(scenario.id)}>{scenario.label}</button>)}</div></section>;
}
