/** Tags CRUD — admin only for POST/DELETE, public GET */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function slugify(s: string) {
  return s.trim().replace(/\s+/g, "-").toLowerCase();
}

export async function GET() {
  const tags = await db.tag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ items: tags });
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return e as Response; }
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const name = (body.name || "").trim();
  if (!name || name.length < 2) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  const slug = slugify(name);
  try {
    const tag = await db.tag.create({ data: { name, slug } });
    return NextResponse.json(tag, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "الوسم موجود بالفعل" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
