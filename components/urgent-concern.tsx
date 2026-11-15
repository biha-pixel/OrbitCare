"use client";
import { useEffect, useRef } from "react";
import { ShieldAlert, X } from "lucide-react";
import EmergencyGuidance from "./emergency-guidance";

export default function UrgentConcern({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; element?.showModal(); element?.querySelector<HTMLHeadingElement>("h2")?.focus({ preventScroll: true }); return () => element?.close(); }, []);
  return <dialog ref={dialog} className="entry-dialog urgent-dialog" aria-labelledby="urgent-heading" onCancel={onClose}>
    <div className="dialog-heading"><span className="urgent-symbol"><ShieldAlert size={24} aria-hidden="true" /></span><button className="icon-button" type="button" onClick={onClose} aria-label="Close urgent concern"><X size={21} /></button></div>
    <EmergencyGuidance />
  </dialog>;
}
