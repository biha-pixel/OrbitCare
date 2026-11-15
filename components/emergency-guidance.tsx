import { ArrowUpRight, CircleAlert, ExternalLink } from "lucide-react";
import { careSources } from "@/data/guidance";
import { PROTOCOL_NOTICE } from "@/lib/crew-incident";

export default function EmergencyGuidance({ headingId = "urgent-heading" }: { headingId?: string }) {
  return <div className="emergency-guidance">
    <span className="urgent-kicker">User-reported urgent concern · separate from trend monitoring</span>
    <h2 id={headingId} tabIndex={-1}>Use your mission emergency procedures now.</h2>
    <p className="urgent-lead">For a serious or urgent health concern, immediately follow your crew’s approved emergency medical procedures and contact the designated Crew Medical Officer or appropriate medical support through the channels specified by those procedures.</p>
    <div className="urgent-boundary"><CircleAlert size={21} aria-hidden="true" /><p><strong>Do not wait for three days of changed readings.</strong> An unflagged or missing trend cannot establish safety. OrbitCare cannot diagnose or evaluate an emergency.</p></div>
    <div className="urgent-facts"><p><strong>No contact has been made by OrbitCare.</strong> Opening this guidance does not alert anyone. OrbitCare has not detected unconsciousness or assessed the person’s condition.</p><p><strong>Ground support may be delayed or unavailable.</strong> Follow the approved onboard procedures and trained personnel’s direction.</p><p><strong>No mission protocol is installed here.</strong> {PROTOCOL_NOTICE} Use your actual approved procedures and designated communication channels outside OrbitCare. Do not delay the response to complete an entry.</p></div>
    <details className="urgent-sources"><summary>Why this pathway is separate</summary><p>NASA’s published care and training requirements assign medical responsibilities to mission medical personnel and require mission-specific training. They are standards, not a treatment checklist for this prototype. Section 3.5 also discusses recording medical encounters and observations. OrbitCare’s optional handoff fields are an unvalidated software design, not an approved clinical handoff format.</p>{(["medical", "training"] as const).map(id => <a key={id} href={careSources[id].url} target="_blank" rel="noreferrer">{careSources[id].label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}<p className="small-note">This guidance is available offline after app preparation. External standards require internet. They do not replace the crew’s approved protocol.</p></details>
    <div className="urgent-footer"><ExternalLink size={16} aria-hidden="true" /><span>Use your approved mission protocol and designated contact channel outside OrbitCare.</span></div>
  </div>;
}
