"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DB_NAME = "housekeeping-offline";
const STORE_NAME = "pending-actions";

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function queueAction(action: {
  url: string;
  body: Record<string, unknown>;
}) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put({
    id: crypto.randomUUID(),
    ...action,
    queuedAt: Date.now(),
  });
}

export function useOnlineSync() {
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
    }

    async function syncPending() {
      if (!navigator.onLine) return;
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const all: Array<{ id: string; url: string; body: Record<string, unknown> }> =
        await new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });

      for (const action of all) {
        try {
          await fetch(action.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.body),
          });
          store.delete(action.id);
        } catch {
          break;
        }
      }
    }

    window.addEventListener("online", syncPending);

    return () => window.removeEventListener("online", syncPending);
  }, [pathname]);
}
