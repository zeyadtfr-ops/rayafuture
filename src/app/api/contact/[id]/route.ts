/** DELETE /api/contact/[id] — admin only */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAdmin(); } catch (e) { return e as Response; }
  const { id } = await params;
  try {
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
}

/** PUT /api/contact/[id] — update status (admin only) */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAdmin(); } catch (e) { return e as Response; }
  const { id } = await params;
  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const updated = await db.contactMessage.update({
    where: { id },
    data: { status: body.status || "read" },
  });
  return NextResponse.json(updated);
}
