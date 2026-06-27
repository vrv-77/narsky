import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { hasSupabaseServiceEnv } from "@/lib/env";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_MS = 30 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

const localAttempts = new Map<
  string,
  { failures: number[]; blockedUntil?: number }
>();

export async function assertAdminLoginRateLimit(identifier: string) {
  if (hasSupabaseServiceEnv()) {
    const supabase = createSupabaseServiceRoleClient();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from("admin_login_attempts")
      .select("blocked_until")
      .eq("ip_address", identifier)
      .not("blocked_until", "is", null)
      .gt("blocked_until", nowIso)
      .order("blocked_until", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.blocked_until) {
      return {
        allowed: false,
        reason:
          "Demasiados intentos fallidos. Espera unos minutos antes de reintentar.",
      };
    }
  } else {
    const entry = localAttempts.get(identifier);
    if (entry?.blockedUntil && entry.blockedUntil > Date.now()) {
      return {
        allowed: false,
        reason:
          "Demasiados intentos fallidos. Espera unos minutos antes de reintentar.",
      };
    }
  }

  return { allowed: true };
}

export async function registerAdminLoginAttempt(input: {
  ipAddress: string;
  userAgent: string | null;
  success: boolean;
  userId?: string | null;
  failureReason?: string | null;
}) {
  const { ipAddress, success, userAgent, userId, failureReason } = input;

  if (hasSupabaseServiceEnv()) {
    const supabase = createSupabaseServiceRoleClient();
    let blockedUntil: string | null = null;

    if (!success) {
      const sinceIso = new Date(Date.now() - LOGIN_WINDOW_MS).toISOString();
      const { count } = await supabase
        .from("admin_login_attempts")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ipAddress)
        .eq("success", false)
        .gte("attempted_at", sinceIso);

      if ((count ?? 0) + 1 >= LOGIN_MAX_ATTEMPTS) {
        blockedUntil = new Date(Date.now() + LOGIN_BLOCK_MS).toISOString();
      }
    }

    await supabase.from("admin_login_attempts").insert({
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      user_id: userId ?? null,
      failure_reason: failureReason ?? null,
      blocked_until: blockedUntil,
      identifier: "admin",
    });

    return blockedUntil;
  }

  const entry = localAttempts.get(ipAddress) ?? { failures: [] };
  const now = Date.now();
  entry.failures = entry.failures.filter((timestamp) => now - timestamp < LOGIN_WINDOW_MS);

  if (!success) {
    entry.failures.push(now);
    if (entry.failures.length >= LOGIN_MAX_ATTEMPTS) {
      entry.blockedUntil = now + LOGIN_BLOCK_MS;
    }
  } else {
    entry.failures = [];
    entry.blockedUntil = undefined;
  }

  localAttempts.set(ipAddress, entry);
  return entry.blockedUntil ? new Date(entry.blockedUntil).toISOString() : null;
}
