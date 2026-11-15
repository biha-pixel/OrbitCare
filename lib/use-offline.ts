"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const subscribeConnection = (callback: () => void) => {
  window.addEventListener("online", callback); window.addEventListener("offline", callback);
  return () => { window.removeEventListener("online", callback); window.removeEventListener("offline", callback); };
};
const subscribeCapability = () => () => {};

export function useOffline() {
  const online = useSyncExternalStore(subscribeConnection, () => navigator.onLine, () => true);
  const supported = useSyncExternalStore(subscribeCapability, () => "serviceWorker" in navigator, () => true);
  const [status, setStatus] = useState(process.env.NODE_ENV === "production" ? "Preparing offline access" : "Offline access tested in production build");
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const check = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return false;
    return new Promise<boolean>(resolve => {
      const channel = new MessageChannel();
      const timer = window.setTimeout(() => { channel.port1.close(); resolve(false); }, 8000);
      channel.port1.onmessage = event => { window.clearTimeout(timer); channel.port1.close(); resolve(event.data?.ready === true); };
      navigator.serviceWorker.controller!.postMessage({ type: "CHECK_READY" }, [channel.port2]);
    });
  }, []);
  useEffect(() => {
    let active = true;
    const verify = async () => {
      const complete = await check();
      if (active) { setReady(complete); setStatus(complete ? "Offline ready" : "Offline preparation incomplete"); }
    };
    const controllerChanged = () => { setWaiting(null); void verify(); };
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", controllerChanged);
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then(reg => {
        if (!active) return;
        setRegistration(reg);
        if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          worker?.addEventListener("statechange", () => {
            if (active && worker.state === "installed" && reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
            if (active && worker.state === "redundant") setStatus("Offline preparation failed. Reconnect and retry.");
          });
        });
        void navigator.serviceWorker.ready.then(verify);
      }).catch(() => { if (active) setStatus("Offline preparation failed. Reconnect and retry."); });
    }
    return () => { active = false; if ("serviceWorker" in navigator) navigator.serviceWorker.removeEventListener("controllerchange", controllerChanged); };
  }, [check]);
  const retry = async () => {
    if (!("serviceWorker" in navigator)) return;
    setStatus("Checking offline preparation");
    try {
      await registration?.update();
      if (!registration) { await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }); window.location.reload(); return; }
      const complete = await check(); setReady(complete); setStatus(complete ? "Offline ready" : "Offline preparation incomplete. Reload while online to retry.");
    } catch { setStatus("Offline preparation failed. Reconnect and retry."); }
  };
  const applyUpdate = () => {
    if (!waiting) return;
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
    waiting.postMessage({ type: "ACTIVATE_UPDATE" });
  };
  return { online, ready, status: supported ? status : "Offline reopening unavailable in this browser", waiting, retry, applyUpdate };
}
