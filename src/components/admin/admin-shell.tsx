import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
  role: string;
  email: string | undefined;
};

export function AdminShell({
  children,
  role,
  email,
}: AdminShellProps) {
  return (
    <div className="admin-grid bg-[linear-gradient(180deg,#f7f2ea_0%,#f4eee5_100%)]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminHeader role={role} email={email} />
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
