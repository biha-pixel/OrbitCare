import type { AppState } from "./types";
import { validateState } from "./validation";

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("orbitcare", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("state");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Local storage could not be opened."));
    request.onblocked = () => reject(new Error("Close other OrbitCare tabs to update local storage."));
  });
}
export async function loadState(): Promise<AppState | null> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("state", "readonly");
    const request = tx.objectStore("state").get("workspace");
    request.onsuccess = () => {
      try { resolve(request.result ? validateState(request.result) : null); } catch { reject(new Error("Saved data could not be validated. Export this session before resetting data.")); }
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  });
}
export async function saveState(state: AppState): Promise<void> {
  validateState(state);
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("state", "readwrite");
    tx.objectStore("state").put(state, "workspace");
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error("Changes could not be saved on this device.")); };
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error("Local save was interrupted.")); };
  });
}
