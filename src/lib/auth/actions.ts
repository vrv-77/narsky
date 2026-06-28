"use server";

import { timingSafeEqual } from "node:crypto";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  getServerEnv,
  hasAdminAuthEnv,
  hasAdminSupabaseAuthEnv,
} from "@/lib/env";
import { clearAdminSession, setAdminSession } from "@/lib/auth/admin";
import {
  assertAdminLoginRateLimit,
  registerAdminLoginAttempt,
} from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminLoginSchema } from "@/lib/validation/auth";

export type AdminAuthActionState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAdminAction(
  _previousState: AdminAuthActionState,
  formData: FormData,
): Promise<AdminAuthActionState> {
  if (!hasAdminAuthEnv()) {
    return {
      status: "error",
      message:
        "Faltan variables para autenticar al administrador. Configura `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`, o bien `ADMIN_EMAIL` junto a Supabase.",
    };
  }

  const parsedData = adminLoginSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return {
      status: "error",
      message: parsedData.error.issues[0]?.message ?? "Contraseña inválida.",
    };
  }

  const headerStore = await headers();
  const ipAddress =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";
  const userAgent = headerStore.get("user-agent");

  const rateLimit = await assertAdminLoginRateLimit(ipAddress);
  if (!rateLimit.allowed) {
    return {
      status: "error",
      message: rateLimit.reason,
    };
  }

  const env = getServerEnv();

  if (!hasAdminSupabaseAuthEnv()) {
    const expectedPassword = env.ADMIN_PASSWORD ?? "";
    const providedPassword = parsedData.data.password;
    const passwordMatches =
      expectedPassword.length === providedPassword.length &&
      timingSafeEqual(
        Buffer.from(expectedPassword),
        Buffer.from(providedPassword),
      );

    if (!passwordMatches) {
      await registerAdminLoginAttempt({
        ipAddress,
        userAgent,
        success: false,
        failureReason: "invalid_credentials",
      });

      return {
        status: "error",
        message: "La contraseña es incorrecta.",
      };
    }

    await setAdminSession("local-admin", "admin");
    await registerAdminLoginAttempt({
      ipAddress,
      userAgent,
      success: true,
      userId: "local-admin",
    });

    redirect("/admin");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env.ADMIN_EMAIL!,
    password: parsedData.data.password,
  });

  if (error || !data.user) {
    await registerAdminLoginAttempt({
      ipAddress,
      userAgent,
      success: false,
      failureReason: "invalid_credentials",
    });

    return {
      status: "error",
      message: "La contraseña es incorrecta o la cuenta no está disponible.",
    };
  }

  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("role, is_active")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminRole) {
    await supabase.auth.signOut();
    await clearAdminSession();
    await registerAdminLoginAttempt({
      ipAddress,
      userAgent,
      success: false,
      userId: data.user.id,
      failureReason: "missing_admin_role",
    });

    return {
      status: "error",
      message:
        "La cuenta autenticada no tiene permisos administrativos activos.",
    };
  }

  await setAdminSession(data.user.id, adminRole.role as "admin" | "editor");
  await registerAdminLoginAttempt({
    ipAddress,
    userAgent,
    success: true,
    userId: data.user.id,
  });

  redirect("/admin");
}

export async function logoutAdminAction() {
  if (hasAdminSupabaseAuthEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  await clearAdminSession();
  redirect("/admin/login");
}
