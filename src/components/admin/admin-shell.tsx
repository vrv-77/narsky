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
    <div className="admin-grid bg-[radial-gradient(circle_at_top_left,rgba(255,79,216,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(52,215,255,0.12),transparent_22%),linear-gradient(180deg,#070b1d_0%,#050814_100%)]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminHeader role={role} email={email} />
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
