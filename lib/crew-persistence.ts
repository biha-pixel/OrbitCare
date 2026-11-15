import { database } from "./persistence";
import { incidentRegistrySchema, type CrewIncident } from "./crew-incident";

export async function loadIncidents(): Promise<CrewIncident[]> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("state", "readonly");
    const request = tx.objectStore("state").get("crew-incidents");
    request.onsuccess = () => { try { resolve(request.result ? incidentRegistrySchema.parse(request.result).incidents : []); } catch { reject(new Error("Stored incidents could not be validated; stored records have not been overwritten.")); } };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
export async function saveIncidents(incidents: CrewIncident[]): Promise<void> {
  const value = incidentRegistrySchema.parse({ version: 1, incidents });
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("state", "readwrite");
    tx.objectStore("state").put(value, "crew-incidents");
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
