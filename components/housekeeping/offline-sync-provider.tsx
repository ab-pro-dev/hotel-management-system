"use client";

import { useOnlineSync } from "@/lib/offline-queue";

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  useOnlineSync();

  return <>{children}</>;
}
