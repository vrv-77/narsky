import { ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/admin/logout-button";

type AdminHeaderProps = {
  role: string;
  email: string | undefined;
};

export function AdminHeader({ role, email }: AdminHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-black/8 bg-white/75 px-6 py-5 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--secondary)] text-white">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Sesión protegida
          </p>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {email || "Administrador oculto"} · {role}
          </p>
        </div>
      </div>
      <LogoutButton />
    </header>
  );
}
