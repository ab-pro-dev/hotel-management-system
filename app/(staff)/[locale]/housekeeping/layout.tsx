import type { Metadata, Viewport } from "next";
import { OfflineSyncProvider } from "@/components/housekeeping/offline-sync-provider";

export const metadata: Metadata = {
  title: "Housekeeping — Grand Raya Hotel",
  description: "Housekeeping dashboard with offline support",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Housekeeping",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F3D2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function HousekeepingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OfflineSyncProvider>
      {children}
    </OfflineSyncProvider>
  );
}
