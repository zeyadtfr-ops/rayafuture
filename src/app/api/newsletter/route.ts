/** Newsletter subscribe — public POST, admin GET */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";

// POST — public, subscribe email
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const email = (body.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
  }
  // Check if already subscribed
  const existing = await db.newsletter.findUnique({ where: { email } });
  if (existing) {
    if (existing.status === "active") {
      return NextResponse.json({ ok: true, message: "أنت مشترك بالفعل" });
    }
    // Reactivate
    await db.newsletter.update({ where: { id: existing.id }, data: { status: "active" } });
    return NextResponse.json({ ok: true, message: "تم إعادة تفعيل اشتراكك" });
  }
  await db.newsletter.create({ data: { email } });
  return NextResponse.json({ ok: true, message: "تم اشتراكك بنجاح!" }, { status: 201 });
}

// GET — admin, list subscribers
export async function GET() {
  const admin = await isAdminAuthorized();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.newsletter.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}
