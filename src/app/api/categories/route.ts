/** Categories CRUD — admin only for POST/PUT/DELETE, public GET */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function slugify(s: string) {
  return s.trim().replace(/\s+/g, "-").toLowerCase();
}

// GET — public, list all categories
export async function GET() {
  const cats = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items: cats });
}

// POST — admin, create category
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return e as Response; }
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const name = (body.name || "").trim();
  if (!name || name.length < 2) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  const slug = body.slug ? body.slug : slugify(name);
  try {
    const cat = await db.category.create({ data: { name, slug, description: body.description || null, color: body.color || "#C9A04A", sortOrder: body.sortOrder || 0 } });
    return NextResponse.json(cat, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "الاسم أو الـ slug موجود بالفعل" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
