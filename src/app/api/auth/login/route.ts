/**
 * POST /api/auth/login  — verify admin credentials.
 *
 * Accepts two login modes:
 *  1. Master password:  { password: "..." }
 *  2. Member login:      { email: "...", password: "..." }
 *
 * Returns the session info so the frontend knows which headers to send
 * on subsequent requests.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getAdminPassword } from "@/lib/auth";

// ── In-memory rate limiter (per IP) ──
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 دقيقة

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (now - record.lastAttempt >= WINDOW_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  loginAttempts.set(ip, record);
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  // ── Rate limiting ──
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "كتير محاولات فاشلة. حاول تاني بعد 15 دقيقة." },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Mode 1: member login (email + password)
  if (body.email) {
    const email = String(body.email).trim().toLowerCase();
    const password = body.password || "";
    if (!password) {
      return NextResponse.json({ error: "كلمة المرور مطلوبة" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    clearAttempts(ip);
    return NextResponse.json({
      ok: true,
      mode: "member",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  }

  // Mode 2: master password
  const password = body.password;
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }
  if (password !== getAdminPassword()) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  clearAttempts(ip);
  return NextResponse.json({ ok: true, mode: "master", role: "admin" });
}
