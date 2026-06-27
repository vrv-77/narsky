import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession } from "@/lib/auth/admin";
import { hasAdminAuthEnv } from "@/lib/env";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <AdminLoginForm isConfigured={hasAdminAuthEnv()} />
    </div>
  );
}
