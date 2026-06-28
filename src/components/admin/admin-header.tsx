import { ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/admin/logout-button";

type AdminHeaderProps = {
  role: string;
  email: string | undefined;
};

export function AdminHeader({ role, email }: AdminHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-[rgba(7,11,29,0.88)] px-6 py-5 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--secondary)] text-white shadow-[0_0_24px_rgba(52,215,255,0.3)]">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[rgba(193,208,255,0.78)]">
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
