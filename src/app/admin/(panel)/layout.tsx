import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";

type AdminPanelLayoutProps = {
  children: ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const admin = await requireAdminSession();

  return <AdminShell role={admin.role} email={admin.user.email}>{children}</AdminShell>;
}
