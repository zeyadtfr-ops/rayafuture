/**
 * Simple admin authentication helpers.
 *
 * Uses an env-based shared password (ADMIN_PASSWORD) for the single-admin
 * magazine use case. The browser sends the password via the
 * `x-admin-password` header on every mutating request.
 *
 * For multi-user / production scenarios, replace this with NextAuth.js
 * (already installed) — the rest of the system does not depend on the
 * specific auth implementation.
 */

import { headers } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raya-admin-2026";

export function getAdminPassword(): string {
  return ADMIN_PASSWORD;
}

/**
 * Returns true if the incoming request carries a valid admin password.
 * Server-side only — never expose the password to the client.
 */
export async function isAdminAuthorized(): Promise<boolean> {
  const h = await headers();
  const provided = h.get("x-admin-password");
  if (!provided) return false;
  return provided === ADMIN_PASSWORD;
}

/**
 * Throws a 401 response when the caller is not authorized.
 * Use at the top of any mutating API route.
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
