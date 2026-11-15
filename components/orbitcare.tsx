"use client";
import { useEffect, useMemo, useReducer, useRef, useState, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { Activity, BookOpen, Check, ChevronRight, CircleAlert, Database, FlaskConical, HeartPulse, Info, ShieldAlert, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { analyze } from "@/lib/analysis";
import type { AppState, CheckIn, Indicator, Review, Workspace } from "@/lib/types";
import { initialState, makeScenario, customWorkspace } from "@/data/scenarios";
import { loadState, saveState } from "@/lib/persistence";
import { exportWorkspace, importWorkspace, validateState } from "@/lib/validation";
import { useOffline } from "@/lib/use-offline";
import CheckInDialog from "./check-in-dialog";
import MonitorView from "./monitor-view";
import MethodView from "./method-view";
import DataView from "./data-view";
import UrgentConcern from "./urgent-concern";
import CrewAssist from "./crew-assist";
import BrandMark from "./brand-mark";
const ResearchView = dynamic(() => import("./research-view"), { loading: () => <p className="loading-message">Opening bundled NASA observations…</p> });
const HealthExplorer = dynamic(() => import("./health-explorer"), { loading: () => <p className="loading-message">Opening bundled health explorer…</p> });
type View = "monitor" | "explorer" | "research" | "method" | "data" | "crew";
const navigation = [{ id: "monitor" as const, label: "Health review", icon: HeartPulse }, { id: "explorer" as const, label: "Health explorer", icon: Activity }, { id: "research" as const, label: "NASA research", icon: FlaskConical }, { id: "method" as const, label: "Method & evidence", icon: BookOpen }, { id: "data" as const, label: "Your data", icon: Database }];

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; document.body.append(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export default function OrbitCare() {
  const [state, dispatch] = useReducer((_state: AppState, next: AppState) => next, undefined, initialState);
  const [view, setView] = useState<View>("monitor");
  const [day, setDay] = useState(28);
  const [indicator, setIndicator] = useState<Indicator>("heartRate");
  const [loaded, setLoaded] = useState(false);
  const [storage, setStorage] = useState("Opening local record");
  const [storageError, setStorageError] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [entryDay, setEntryDay] = useState<number | null>(null);
  const [urgentOpen, setUrgentOpen] = useState(false);
  const [crewDirty, setCrewDirty] = useState(false);
  const [investigating, setInvestigating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const offline = useOffline();
  const workspace = state.workspaces.find(item => item.id === state.activeId)!;
  const results = useMemo(() => analyze(workspace, day), [workspace, day]);
  useEffect(() => {
    let active = true;
    loadState().then(saved => {
      if (!active) return;
      if (saved) { dispatch(saved); setDay(saved.workspaces.find(item => item.id === saved.activeId)!.currentDay); }
      setStorage(saved ? "Saved on this device" : "Ready to save locally");
    }).catch(() => { if (active) { setStorageError(true); setStorage("Session only · storage unavailable"); setError("Saved storage could not be opened or validated. Existing stored data has not been overwritten. You can use this session and export your work."); } }).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setDay(previous => { if (previous >= workspace.currentDay) { setPlaying(false); return previous; } return previous + 1; }), 1600);
    return () => window.clearInterval(timer);
  }, [playing, workspace.currentDay]);
  function commit(next: AppState) {
    if (!loaded) return;
    try { validateState(next); } catch { setError("The workspace change could not be validated. No stored data was changed."); return; }
    dispatch(next); setError("");
    if (storageError) { setStorage("Session only · export to keep changes"); return; }
    setStorage("Saving on this device…");
    queue.current = queue.current.catch(() => {}).then(() => saveState(next)).then(() => setStorage("Saved on this device")).catch(() => { setStorageError(true); setStorage("Session only · export to keep changes"); setError("This change is available in memory but could not be saved on this device. Export your workspace before closing the page."); });
  }
  function updateWorkspace(next: Workspace) { commit({ ...state, workspaces: state.workspaces.map(item => item.id === next.id ? next : item) }); }
  function selectWorkspace(id: string) {
    const next = state.workspaces.find(item => item.id === id)!;
    setPlaying(false); setDay(next.currentDay); setMessage(""); commit({ ...state, activeId: id });
  }
  function saveCheckIn(checkIn: CheckIn) {
    updateWorkspace({ ...workspace, currentDay: Math.max(workspace.currentDay, checkIn.day), checkIns: [...workspace.checkIns.filter(item => item.day !== checkIn.day), checkIn].sort((a, b) => a.day - b.day) });
    setDay(checkIn.day); setMessage(`Check-in recorded for mission day ${checkIn.day}. Comparisons recalculated.`);
  }
  function openUrgent() { setPlaying(false); setUrgentOpen(true); }
  function navigate(next: View) {
    if (next === view) return;
    if (view === "crew" && crewDirty && !window.confirm("Leave Crew Assist with unsaved changes? Save or export the incident first to keep your draft.")) return;
    setView(next); setPlaying(false);
  }
  function saveReview(review: Review) { updateWorkspace({ ...workspace, reviews: [...workspace.reviews, review] }); setMessage("Review action recorded locally. Calculated flags are unchanged. Nothing was sent to medical support."); }
  function exportCurrent() { download(exportWorkspace(workspace), `OrbitCare-${workspace.id}-through-day-${workspace.currentDay}.json`); setMessage("Workspace exported. NASA research remains separate from monitoring."); }
  function reset() {
    if (!window.confirm(`Reset “${workspace.name}”? Its check-ins and review actions will be replaced. Export first if you want to keep them.`)) return;
    const next = workspace.scenario && workspace.kind === "scenario" ? makeScenario(workspace.scenario) : { ...workspace, currentDay: 1, checkIns: [], reviews: [] };
    updateWorkspace(next); setDay(next.currentDay); setMessage("Workspace reset. Offline assets remain available.");
  }
  function addCustom() { const next = customWorkspace(); commit({ ...state, activeId: next.id, workspaces: [...state.workspaces, next] }); setDay(1); setView("monitor"); setMessage("Empty test workspace created. Days 1–14 form its fixed reference period."); }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("Import must be smaller than 2 MB.");
      const next = importWorkspace(await file.text(), crypto.randomUUID());
      if (!window.confirm(`Import “${next.name}” as a new workspace with ${next.checkIns.length} check-ins and ${next.reviews.length} review actions? Existing workspaces will remain.`)) return;
      commit({ ...state, activeId: next.id, workspaces: [...state.workspaces, next] }); setDay(next.currentDay); setMessage("Workspace imported. Readings were validated; flags are recalculated locally.");
    } catch (cause) { setError(cause instanceof Error && cause.message.startsWith("Import must") ? cause.message : "Import rejected: use an OrbitCare schema-v1 export with valid units, values, unique days, and rule version. Existing data is unchanged."); }
  }
  return <div className={`app-shell${view === "crew" || urgentOpen ? " crew-mode" : ""}`}><a href="#main-content" className="skip-link">Skip to main content</a>
    <aside className="sidebar"><a className="brand" href="#main-content" aria-label="OrbitCare home" onClick={() => navigate("monitor")}><BrandMark /><span>OrbitCare<span className="brand-caption">Research prototype</span></span></a>
      <div className="workspace-label">Mission workspace</div><nav aria-label="Main navigation">{navigation.map(item => <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} aria-current={view === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><item.icon size={19} />{item.label}{view === item.id && <span className="nav-active-dot" />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="device-status"><span className={`connection-orb ${offline.ready ? "ready" : ""}`} /><div><strong>{offline.status}</strong><span>Local analysis. No cloud account.</span></div></div><div className="crew-identity"><span className="crew-monogram">C1</span><div><strong>Crewmember 01</strong><span>Fictional demonstration profile</span></div></div><p className="sidebar-disclaimer">A research prototype for NASA Space Apps 2026. Not a clinical or flight-certified system.</p></div>
    </aside>
    <div className="app-content"><header className="topbar"><div className="breadcrumb"><span>Mission operations</span><ChevronRight size={14} /><strong>{view === "crew" ? "Crew Assist" : navigation.find(item => item.id === view)!.label}</strong></div><div className="topbar-status"><span className="cache-readiness" title={offline.status}><ShieldCheck size={14} />{offline.status}</span>{offline.online ? <Wifi size={15} /> : <WifiOff size={15} />}<span>{offline.online ? "Browser online" : "Browser offline"}</span><span className="prototype-tag">Research prototype</span></div><button className="urgent-trigger" onClick={openUrgent}><ShieldAlert size={17} aria-hidden="true" />Urgent concern</button></header>
      <main id="main-content" className="main-content">
        <nav className="crew-entry" aria-label="Assistance mode"><button aria-pressed={view !== "crew"} onClick={() => navigate("monitor")}>Monitor my health</button><button aria-pressed={view === "crew"} onClick={() => navigate("crew")}><ShieldAlert size={16} aria-hidden="true" />Help a crewmate</button><span>Crew Assist · same device</span></nav>
        {error && <div className="notice error" role="alert"><CircleAlert size={18} /><span>{error}</span><button className="text-button" onClick={() => setError("")}>Dismiss</button></div>}
        {message && <div className="notice success" role="status"><Check size={17} /><span>{message}</span><button className="text-button" onClick={() => setMessage("")}>Dismiss</button></div>}
        {offline.waiting && <div className="notice"><Info size={17} /><span>An updated application is ready. Save or export work before reloading.</span><button className="text-button" onClick={() => { if (window.confirm("Apply the update and reload? Save or export unsaved work first.")) offline.applyUpdate(); }}>Apply update</button></div>}
        <div key={view} className="view-transition">
        {view === "monitor" && <MonitorView workspace={workspace} day={day} indicator={indicator} results={results} loaded={loaded} playing={playing} investigating={investigating} onInvestigating={open => { setInvestigating(open); if (!open) setPlaying(false); }} onResearch={() => { setPlaying(false); setView("research"); }} selectDay={next => { setPlaying(false); setDay(next); }} selectIndicator={next => { setPlaying(false); setIndicator(next); }} selectWorkspace={selectWorkspace} onCheckIn={() => setEntryDay(day)} onReview={saveReview} onReplay={() => { if (playing) setPlaying(false); else { setDay(Math.min(14, workspace.currentDay)); setPlaying(true); } }} onData={() => setView("data")} onExplorer={() => { setPlaying(false); setView("explorer"); }} onUrgent={openUrgent} />}
        {view === "explorer" && <HealthExplorer initialIndicator={indicator} workspace={workspace} day={day} results={results} onDay={next => { setPlaying(false); setDay(next); }} onMonitor={next => { setIndicator(next); setInvestigating(true); setView("monitor"); }} onUrgent={openUrgent} />}
        {view === "research" && <ResearchView />}{view === "method" && <MethodView />}
        {view === "crew" && <CrewAssist workspace={workspace} day={day} onDirtyChange={setCrewDirty} />}
        {view === "data" && <DataView state={state} workspace={workspace} loaded={loaded} storage={storage} offlineStatus={offline.status} offlineReady={offline.ready} onSelect={selectWorkspace} onCustom={addCustom} onExport={exportCurrent} onImport={importFile} onReset={reset} onRetry={() => void offline.retry()} />}
        </div><footer className="page-footer"><span><ShieldCheck size={14} />Research prototype · not a medical device</span><span>{storage}<span className="footer-dot">·</span>OrbitCare 1.0</span></footer>
      </main>
    </div>{entryDay !== null && <CheckInDialog workspace={workspace} initialDay={entryDay} onClose={() => setEntryDay(null)} onSave={saveCheckIn} onUrgent={() => { setEntryDay(null); openUrgent(); }} />}{urgentOpen && <UrgentConcern onClose={() => setUrgentOpen(false)} />}
  </div>;
}
