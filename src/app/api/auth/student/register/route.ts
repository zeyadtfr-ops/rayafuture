/**
 * POST /api/auth/student/register
 *
 * Student registration using their unique student code.
 *
 * Body: { studentCode, name, password }
 *
 * The studentCode is a unique identifier assigned to each student by the
 * institute (e.g. "RAYA-2026-001"). Students use it to register and login.
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
  const name = (body.name || "").trim();
  const password = body.password || "";

  // Validation
  if (!studentCode || studentCode.length < 3) {
    return NextResponse.json(
      { error: "كود الطالب مطلوب (٣ أحرف على الأقل)" },
      { status: 400 }
    );
  }
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "الاسم مطلوب (حرفان على الأقل)" },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "كلمة المرور مطلوبة (٦ أحرف على الأقل)" },
      { status: 400 }
    );
  }

  // Check if student code already registered
  const existing = await db.user.findUnique({ where: { studentCode } });
  if (existing) {
    return NextResponse.json(
      { error: "هذا الكود مسجل بالفعل. سجل الدخول بدلاً من ذلك." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      studentCode,
      name,
      role: "student",
      passwordHash,
    },
    select: {
      id: true,
      studentCode: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    { ok: true, user, mode: "student" },
    { status: 201 }
  );
}
