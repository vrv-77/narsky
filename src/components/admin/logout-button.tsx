"use client";

import { useFormStatus } from "react-dom";

import { logoutAdminAction } from "@/lib/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full border border-white/12 bg-[rgba(18,24,56,0.96)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[0_0_18px_rgba(52,215,255,0.12)] hover:bg-[rgba(28,36,78,0.98)] disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAdminAction}>
      <SubmitButton />
    </form>
  );
}
