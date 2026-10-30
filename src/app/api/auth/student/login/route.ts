/**
 * POST /api/auth/student/login
 *
 * Student login using student code + password.
 *
 * Body: { studentCode, password }
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const studentCode = (body.studentCode || "").trim().toUpperCase();
  const password = body.password || "";

  if (!studentCode || !password) {
    return NextResponse.json(
      { error: "كود الطالب وكلمة المرور مطلوبان" },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { studentCode } });

  if (!user || user.role !== "student" || !user.passwordHash) {
    return NextResponse.json(
      { error: "كود الطالب أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "كود الطالب أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "student",
    user: {
      id: user.id,
      studentCode: user.studentCode,
      name: user.name,
      role: user.role,
    },
  });
}
