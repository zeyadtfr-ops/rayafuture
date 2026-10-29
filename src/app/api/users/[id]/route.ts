/**
 * DELETE /api/users/[id]  — delete a member (admin only)
 *
 * Safety: prevents deleting yourself (the current session owner) via
 * the X-Current-User-Id header. The frontend sends this header with
 * the logged-in user's ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const { id } = await params;

  // Prevent self-deletion
  const currentUserId = req.headers.get("x-current-user-id");
  if (currentUserId && currentUserId === id) {
    return NextResponse.json(
      { error: "لا يمكنك حذف حسابك أثناء استخدامه" },
      { status: 400 }
    );
  }

  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
  }
}
