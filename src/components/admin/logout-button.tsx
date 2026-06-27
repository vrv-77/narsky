"use client";

import { useFormStatus } from "react-dom";

import { logoutAdminAction } from "@/lib/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:opacity-50"
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
