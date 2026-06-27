"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginAdminAction,
  type AdminAuthActionState,
} from "@/lib/auth/actions";

const initialState: AdminAuthActionState = {
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Validando..." : "Ingresar al panel"}
    </Button>
  );
}

export function AdminLoginForm({ isConfigured }: { isConfigured: boolean }) {
  const [state, formAction] = useActionState(loginAdminAction, initialState);

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[var(--secondary)] text-white">
          <LockKeyhole className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Acceso restringido
          </p>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">
            Panel administrativo
          </h1>
        </div>
      </div>

      {!isConfigured ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Completa las variables `ADMIN_EMAIL`, `ADMIN_SESSION_SECRET` y las
          credenciales de Supabase para habilitar el ingreso.
        </p>
      ) : null}

      <form action={formAction} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresa la contraseña del administrador"
            required
          />
        </div>

        {state.status === "error" ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {state.message}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </Card>
  );
}
