"use client";

import { usePathname } from "@/i18n/navigation";
import StaffHeader from "@/components/staff-header";

export default function ConditionalStaffHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <StaffHeader />;
}
