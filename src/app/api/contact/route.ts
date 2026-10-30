/**
 * POST /api/contact  — public contact form submission
 *
 * Body: { name, email, subject, message, phone? }
 *
 * Validates input, stores in DB, returns success.
 * No authentication required (public form).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();
  const phone = body.phone ? String(body.phone).trim() : null;

  // Validation
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
  }
  if (!subject || subject.length < 3) {
    return NextResponse.json({ error: "الموضوع مطلوب" }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ error: "الرسالة قصيرة جداً (١٠ أحرف على الأقل)" }, { status: 400 });
  }

  // Rate limiting: max 5 messages per email per hour (simple check)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await db.contactMessage.count({
    where: {
      email,
      createdAt: { gte: oneHourAgo },
    },
  });
  if (recentCount >= 5) {
    return NextResponse.json(
      { error: "لقد أرسلت رسائل كثيرة. حاول مرة أخرى لاحقاً." },
      { status: 429 }
    );
  }

  const contactMessage = await db.contactMessage.create({
    data: { name, email, subject, message, phone },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json(
    { ok: true, id: contactMessage.id, message: "تم استلام رسالتك بنجاح" },
    { status: 201 }
  );
}

/**
 * GET /api/contact  — list contact messages (admin only)
 */
export async function GET(req: NextRequest) {
  const { isAdminAuthorized } = await import("@/lib/auth");
  const ok = await isAdminAuthorized();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 50)));

  const where = status ? { status } : {};
  const items = await db.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ items });
}
