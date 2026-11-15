import { ArrowUpRight } from "lucide-react";
import { evidence } from "@/data/evidence";

const connections = [
  { id: "cardiovascular", feature: "Compare resting heart rate", use: "A personal pulse record provides limited context for adaptation. Select the chest in the explorer to connect the reading with the research." },
  { id: "sleep", feature: "Keep sleep and fatigue together", use: "Sleep duration and reported fatigue are separate observations. They give context for a review; neither measures circadian alignment." },
  { id: "standard", feature: "Follow observations over time", use: "A fixed personal reference and an as-of-day replay make repeated observations inspectable. This reference period is our engineering choice." },
  { id: "medical", feature: "Keep review within its limits", use: "Local review records and the independent urgent-concern pathway point to designated personnel and approved procedures. Saving an action sends no message." },
] as const;

export default function ResearchConnections({ onResearch }: { onResearch: () => void }) {
  return <details className="research-connections surface"><summary>How NASA research informs this experience</summary><p className="connections-intro">Research informs what we record and how we explain its limits. The change thresholds and three-day rule are unvalidated engineering assumptions.</p><p className="challenge-source-link">Challenge resource: <a href="https://www.nasa.gov/hrp/risks/" target="_blank" rel="noreferrer">NASA Risks of Human Spaceflight</a>. Its risk-specific research connects to the features below.</p><div className="connections-grid">{connections.map(connection => {
    const source = evidence.find(item => item.id === connection.id)!;
    return <article key={connection.id}><h3>{connection.feature}</h3><p>{source.text}</p><p className="feature-connection"><strong>In OrbitCare</strong>{connection.use}</p><a href={source.url} target="_blank" rel="noreferrer">{source.source}<ArrowUpRight size={14} aria-hidden="true" /></a><p className="small-note">{source.limitation}</p></article>;
  })}</div><div className="real-data-connection"><h3>Real NASA measurements, kept separate</h3><p>OSD-575 contributes 56 original sodium and potassium observations from four Inspiration4 participants across seven ground visits, in mmol/L. They can be inspected by participant and visit, with the original CSV and provenance.</p><p>These laboratory measurements do not calibrate or validate our heart-rate, sleep or fatigue rules. No monitoring threshold is applied to them.</p><button className="text-button" onClick={onResearch}>Inspect the original OSD-575 measurements<ArrowUpRight size={16} aria-hidden="true" /></button></div></details>;
}
