import { createHmac, timingSafeEqual } from "node:crypto";

import { getServerEnv } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "nn-admin-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  role: "admin" | "editor";
  exp: number;
};

function sign(value: string) {
  const secret = getServerEnv().ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Falta ADMIN_SESSION_SECRET para firmar la sesión administrativa.",
    );
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function buildAdminSessionToken(userId: string, role: "admin" | "editor") {
  const payload: SessionPayload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  if (signature.length !== expectedSignature.length) {
    return null;
  }

  const isValidSignature = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );

  if (!isValidSignature) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as SessionPayload;

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
