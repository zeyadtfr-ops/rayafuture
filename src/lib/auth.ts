/**
 * Admin authentication helpers.
 *
 * Supports TWO login methods:
 *  1. Master password (env var ADMIN_PASSWORD) — no fallback default.
 *  2. Member login (email + password) — stored in the User table with bcrypt.
 *
 * The browser sends credentials via the `x-admin-password` header (master)
 * or `x-admin-email` + `x-admin-token` headers (member login).
 */

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function getAdminPassword(): string {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD env var is required and must be at least 8 characters. " +
      "Set it in Vercel Project Settings → Environment Variables."
    );
  }
  return ADMIN_PASSWORD;
}

/** Constant-time string compare to prevent timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export type SessionUser =
  | { kind: "master"; role: "admin" }
  | { kind: "member"; id: string; email: string; name: string | null; role: string }
  | null;

/**
 * Resolves the current session user from request headers.
 * Returns null if not authenticated.
 */
export async function getSessionUser(): Promise<SessionUser> {
  const h = await headers();

  // Method 1: master password (constant-time compare)
  const pw = h.get("x-admin-password");
  if (pw) {
    try {
      const adminPassword = getAdminPassword();
      if (safeEqual(pw, adminPassword)) {
        return { kind: "master", role: "admin" };
      }
    } catch {
      // ADMIN_PASSWORD env var not configured.
    }
  }

  // Method 2: member login (email + token = hashed password)
  const email = h.get("x-admin-email");
  const token = h.get("x-admin-token");
  if (email && token) {
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user && user.passwordHash) {
      const ok = await bcrypt.compare(token, user.passwordHash);
      if (ok) {
        return {
          kind: "member",
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }
  }

  return null;
}

/**
 * Returns true if the incoming request is from an authorized admin.
 */
export async function isAdminAuthorized(): Promise<boolean> {
  const session = await getSessionUser();
  return session !== null;
}

/**
 * Throws a 401 response when the caller is not authorized.
 */
export async function requireAdmin(): Promise<void> {
  const ok = await isAdminAuthorized();
  if (!ok) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
}
