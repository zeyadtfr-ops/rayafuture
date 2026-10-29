/**
 * POST /api/auth/login  — verify admin password and return a flag.
 *
 * The browser stores the password in sessionStorage and sends it as the
 * `x-admin-password` header on every mutating request.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body?.password;
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, role: "admin" });
}
