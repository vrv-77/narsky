import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  getServerEnv,
  hasAdminLocalAuthEnv,
  hasAdminSupabaseAuthEnv,
} from "@/lib/env";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionToken,
  getAdminSessionCookieOptions,
  verifyAdminSessionToken,
} from "@/lib/security/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminSession } from "@/types/domain";

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const payload = verifyAdminSessionToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    role: payload.role,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
  };
}

export async function setAdminSession(userId: string, role: "admin" | "editor") {
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    buildAdminSessionToken(userId, role),
    getAdminSessionCookieOptions(),
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getVerifiedAdminUser() {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  if (hasAdminSupabaseAuthEnv()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== session.userId) {
      return null;
    }

    const { data: adminRole } = await supabase
      .from("admin_roles")
      .select("role, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!adminRole) {
      return null;
    }

    return {
      user,
      role: adminRole.role as "admin" | "editor",
    };
  }

  if (hasAdminLocalAuthEnv()) {
    const env = getServerEnv();

    if (session.userId !== "local-admin") {
      return null;
    }

    return {
      user: {
        id: "local-admin",
        email: env.ADMIN_EMAIL ?? "admin@narsky.local",
      },
      role: session.role,
    };
  }

  return null;
}

export async function requireAdminSession() {
  const verifiedUser = await getVerifiedAdminUser();

  if (!verifiedUser) {
    redirect("/admin/login");
  }

  return verifiedUser;
}
