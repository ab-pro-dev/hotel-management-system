import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/dashboard/admin-sidebar";
import AdminTopbar from "@/components/admin/dashboard/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar />
        <div className="flex-1 overflow-auto bg-[#F8F9FB] dark:bg-background p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
