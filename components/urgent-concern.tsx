"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight, CircleAlert, ExternalLink, ShieldAlert, X } from "lucide-react";
import { careSources } from "@/data/guidance";

export default function UrgentConcern({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; element?.showModal(); element?.querySelector<HTMLHeadingElement>("h2")?.focus({ preventScroll: true }); return () => element?.close(); }, []);
  return <dialog ref={dialog} className="entry-dialog urgent-dialog" aria-labelledby="urgent-heading" onCancel={onClose}>
    <div className="dialog-heading"><span className="urgent-symbol"><ShieldAlert size={24} aria-hidden="true" /></span><button className="icon-button" type="button" onClick={onClose} aria-label="Close urgent concern"><X size={21} /></button></div>
    <span className="urgent-kicker">Acute concern · separate from trend monitoring</span><h2 id="urgent-heading" tabIndex={-1}>Use your mission emergency procedures now.</h2>
    <p className="urgent-lead">For a serious or urgent health concern, immediately follow your crew’s approved emergency medical procedures and contact the designated Crew Medical Officer or appropriate medical support through the channels specified by those procedures.</p>
    <div className="urgent-boundary"><CircleAlert size={21} aria-hidden="true" /><p><strong>Do not wait for three days of changed readings.</strong> An unflagged or missing trend cannot establish safety. OrbitCare cannot diagnose or evaluate an emergency.</p></div>
    <div className="urgent-facts"><p><strong>No contact has been made.</strong> Opening this panel does not alert anyone. Ordinary review notes are local records, not communications.</p><p><strong>Ground support may be delayed or unavailable.</strong> Follow the approved onboard procedures and trained personnel’s direction.</p><p><strong>No mission protocol is installed here.</strong> This panel is a reference signpost, not emergency treatment guidance. Do not delay using your approved procedures to complete an OrbitCare entry.</p></div>
    <details className="urgent-sources"><summary>Why this pathway is separate</summary><p>NASA’s published care and training requirements assign medical responsibilities to mission medical personnel and require mission-specific training. They are standards, not a treatment checklist for this prototype.</p>{(["medical", "training"] as const).map(id => <a key={id} href={careSources[id].url} target="_blank" rel="noreferrer">{careSources[id].label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}<p className="small-note">This guidance is available offline after app preparation. External standards require internet. They do not replace the crew’s approved protocol.</p></details>
    <div className="urgent-footer"><ExternalLink size={16} aria-hidden="true" /><span>Use your approved mission protocol and designated contact channel outside OrbitCare.</span></div>
  </dialog>;
}
