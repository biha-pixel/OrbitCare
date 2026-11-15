"use client";
import { useState } from "react";
import { Activity, ArrowUpRight, BookOpen, HeartPulse, Moon, Smile } from "lucide-react";
import { careSources, measurementGuides } from "@/data/guidance";
import type { Metric } from "@/lib/types";

const icons = { heartRate: HeartPulse, sleep: Moon, fatigue: Smile, exercise: Activity };
export default function MeasurementGuide({ initial = "heartRate" }: { initial?: Metric }) {
  const [selected, setSelected] = useState<Metric>(initial);
  const guide = measurementGuides[selected];
  return <details className="measurement-guide"><summary><BookOpen size={17} aria-hidden="true" /><span><strong>How to measure and record</strong><small>Methods, equipment and interpretation limits</small></span></summary><div className="guide-content"><div className="guide-choices" role="group" aria-label="Measurement guides">{(Object.keys(measurementGuides) as Metric[]).map(metric => { const Icon = icons[metric]; return <button type="button" key={metric} aria-pressed={selected === metric} onClick={() => setSelected(metric)}><Icon size={16} aria-hidden="true" />{measurementGuides[metric].title}</button>; })}</div><div key={selected} className="guide-reading motion-enter"><h3>{guide.title}</h3><p>{guide.represents}</p><dl><div><dt>Why it matters in spaceflight</dt><dd>{guide.relevance}</dd></div><div><dt>How to record it</dt><dd>{guide.method}</dd></div><div><dt>Method / equipment assumed</dt><dd>{guide.equipment}</dd></div><div><dt>Check measurement quality</dt><dd>{guide.quality}</dd></div><div><dt>What this cannot establish</dt><dd>{guide.limit}</dd></div></dl><p className="guide-convention">{guide.convention}</p><div className="guide-sources">{guide.sources.map(id => <a key={id} href={careSources[id].url} target="_blank" rel="noreferrer">{careSources[id].label}<ArrowUpRight size={13} aria-hidden="true" /></a>)}</div><p className="small-note">Guidance is bundled for offline reading. Original sources require internet. For serious symptoms, use approved mission procedures immediately.</p></div></div></details>;
}
