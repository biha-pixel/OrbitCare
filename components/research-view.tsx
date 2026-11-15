"use client";
import { useState } from "react";
import { ArrowUpRight, Download, FlaskConical, Info } from "lucide-react";
import research from "@/data/research.json";
const colors = ["#007F78", "#5077A0", "#9A5B00", "#8C5E85"];

export default function ResearchView() {
  const [analyte, setAnalyte] = useState("SODIUM");
  const rows = research.observations.filter(row => row.analyte === analyte);
  const values = rows.map(row => row.value);
  const low = Math.floor(Math.min(...values) - (analyte === "SODIUM" ? 1 : .3));
  const high = Math.ceil(Math.max(...values) + (analyte === "SODIUM" ? 1 : .3));
  const y = (value: number) => 240 - (value - low) / (high - low) * 185;
  const x = (visit: string) => 65 + research.visits.indexOf(visit) * 96 + (visit.startsWith("R") ? 34 : 0);
  return <div className="research-page">
    <div className="section-intro"><span className="section-mark"><FlaskConical size={20} /> NASA research</span><h1>Real observations.<br />A different kind of context.</h1><p>Explore repeated serum measurements around the Inspiration4 mission. These laboratory observations are separate from your simulated monitoring record.</p></div>
    <div className="research-callout"><Info size={19} /><p><strong>Four participants. Three days in space.</strong> Samples were collected on the ground before and after flight. This is not live telemetry and does not validate OrbitCare’s monitoring rules.</p></div>
    <section className="surface research-surface" aria-labelledby="research-heading">
      <div className="surface-heading"><div><span className="subtle-label">OSD-575 · Study version 3</span><h2 id="research-heading">A record across sampling visits</h2></div><div className="segmented" aria-label="Research analyte">{["SODIUM", "POTASSIUM"].map(marker => <button key={marker} aria-pressed={analyte === marker} onClick={() => setAnalyte(marker)}>{marker === "SODIUM" ? "Sodium" : "Potassium"}</button>)}</div></div>
      <div className="research-legend">{research.participants.map((participant, index) => <span key={participant}><i style={{ background: colors[index] }} />{participant}</span>)}<span className="legend-unit">{analyte === "SODIUM" ? "Sodium" : "Potassium"} · mmol/L</span></div>
      <div className="research-plot-scroll"><svg className="research-plot" viewBox="0 0 760 295" role="img" aria-label={`${analyte}, 28 observations from four participants. Original units mmol/L. Unequally spaced sampling visits shown categorically. Full values in the table below.`}>
        <rect x="32" y="25" width="260" height="225" rx="6" fill="#F2F6F3" /><rect x="337" y="25" width="395" height="225" rx="6" fill="#F7F8F9" />
        <text x="54" y="47" className="svg-phase">Pre-flight</text><text x="358" y="47" className="svg-phase">Post-flight</text>
        {[0, 1, 2, 3, 4].map(index => { const value = low + index * (high - low) / 4; return <g key={index}><line x1="43" x2="735" y1={y(value)} y2={y(value)} stroke="#DFE7E3" strokeDasharray="3 5" /><text x="26" y={y(value) + 4} textAnchor="end">{Number.isInteger(value) ? value : value.toFixed(1)}</text></g>; })}
        <path d="M311 60v169" stroke="#C7D3CC" strokeDasharray="4 5" /><text x="311" y="276" textAnchor="middle" className="svg-break">Flight / no samples</text>
        {research.visits.map(visit => <text key={visit} x={x(visit)} y="263" textAnchor="middle">{visit.replace("-", "−")}</text>)}
        {rows.map(row => { const participant = research.participants.indexOf(row.participant); return <circle key={`${row.participant}-${row.visit}`} cx={x(row.visit) + (participant - 1.5) * 10} cy={y(row.value)} r="5" fill={colors[participant]} stroke="#fff" strokeWidth="1.5"><title>{row.participant}, {row.visit}: {row.value} mmol/L</title></circle>; })}
      </svg></div>
      <p className="chart-note">Sampling visits are categorical; horizontal spacing does not represent elapsed time. Dots are original observations. No interpolated in-flight measurements or clinical reference bands are shown.</p>
      <details className="data-details"><summary>Inspect all 28 {analyte.toLowerCase()} observations</summary><div className="table-scroll"><table><caption>{analyte === "SODIUM" ? "Sodium" : "Potassium"} in mmol/L; four coded participants and seven visits</caption><thead><tr><th scope="col">Participant</th>{research.visits.map(visit => <th scope="col" key={visit}>{visit}</th>)}</tr></thead><tbody>{research.participants.map(participant => <tr key={participant}><th scope="row">{participant}</th>{research.visits.map(visit => <td key={visit}>{rows.find(row => row.participant === participant && row.visit === visit)?.value ?? "Missing"}</td>)}</tr>)}</tbody></table></div></details>
    </section>
    <div className="research-notes"><section><h2>What these observations can tell us</h2><p>Repeated measurements preserve individual context that a single pooled number would hide. Explore the actual values without interpreting differences as illness, a flight effect, or proof that a personal monitoring rule works.</p><h3>Collection and methodology</h3><p>{research.methodology}</p><p>Launch-minus (L−) and return-plus (R+) labels use different reference events. The seven visits span substantially more time than the three-day flight.</p></section><section className="provenance"><h2>Follow the evidence</h2><dl><div><dt>Source</dt><dd>NASA Open Science Data Repository</dd></div><div><dt>Study / subset</dt><dd>OSD-575 v3 / 56 selected rows</dd></div><div><dt>Source file</dt><dd>531 result rows; other variables include missing values</dd></div><div><dt>Acquired</dt><dd>{research.acquiredAt.slice(0, 10)} UTC</dd></div></dl><a href="https://osdr.nasa.gov/bio/repo/data/studies/OSD-575" target="_blank" rel="noreferrer">Open original study <ArrowUpRight size={15} /></a><a href="/research/OSD-575-original.csv" download><Download size={15} /> Original CSV · 25 KB</a><a href="/research/OSD-575-provenance.json" download><Download size={15} /> Subset and provenance JSON</a><details><summary>Checksum, permissions, and limitations</summary><p className="checksum">SHA-256: {research.sha256}</p><p>{research.license}</p><a href={research.policy} target="_blank" rel="noreferrer">OSDR redistribution and citation policy <ArrowUpRight size={14} /></a><ul>{research.limitations.map(text => <li key={text}>{text}</li>)}</ul></details></section></div>
  </div>;
}
