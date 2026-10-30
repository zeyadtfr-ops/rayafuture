/**
 * GET  /api/student/notifications       — list student's notifications
 * POST /api/student/notifications       — mark all as read (body: { markAllRead: true })
 * DELETE /api/student/notifications/[id] — delete a notification
 *
 * Student auth via x-student-code + x-student-token headers.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function getStudent(req: NextRequest) {
  const code = req.headers.get("x-student-code");
  const token = req.headers.get("x-student-token");
  if (!code || !token) return null;

  const user = await db.user.findUnique({
    where: { studentCode: code.toUpperCase() },
  });
  if (!user || user.role !== "student" || !user.passwordHash) return null;
  const ok = await bcrypt.compare(token, user.passwordHash);
  return ok ? user : null;
}

export async function GET(req: NextRequest) {
  const student = await getStudent(req);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await db.notification.findMany({
    where: { userId: student.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = await db.notification.count({
    where: { userId: student.id, isRead: false },
  });

  return NextResponse.json({ items: notifications, unreadCount });
}

export async function POST(req: NextRequest) {
  const student = await getStudent(req);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.markAllRead) {
    await db.notification.updateMany({
      where: { userId: student.id, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true, message: "تم تعليم الكل كمقروء" });
  }

  if (body.markRead && body.notificationId) {
    await db.notification.update({
      where: { id: body.notificationId },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
