import { z } from "zod";

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string().url().optional(),
);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  ADMIN_EMAIL: optionalString,
  ADMIN_SESSION_SECRET: optionalString,
  FLOW_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
  FLOW_API_URL: optionalUrl,
  FLOW_API_KEY: optionalString,
  FLOW_SECRET_KEY: optionalString,
  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,
  ADMIN_NOTIFICATION_EMAIL: optionalString,
  STOCK_RESERVATION_MINUTES: z.coerce.number().int().positive().default(15),
});

export function getPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getServerEnv() {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    FLOW_ENVIRONMENT: process.env.FLOW_ENVIRONMENT,
    FLOW_API_URL: process.env.FLOW_API_URL,
    FLOW_API_KEY: process.env.FLOW_API_KEY,
    FLOW_SECRET_KEY: process.env.FLOW_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    STOCK_RESERVATION_MINUTES: process.env.STOCK_RESERVATION_MINUTES,
  });
}

export function hasSupabaseBrowserEnv() {
  const env = getPublicEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function hasSupabaseServiceEnv() {
  const env = getServerEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.SUPABASE_SERVICE_ROLE_KEY &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function hasAdminAuthEnv() {
  const env = getServerEnv();
  return Boolean(
    env.ADMIN_EMAIL &&
      env.ADMIN_SESSION_SECRET &&
      env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
