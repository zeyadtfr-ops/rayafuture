// Quick DB inspection using Prisma client
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const grouped = await db.article.groupBy({
  by: ["status"],
  _count: true,
});
console.log("=== Status counts ===");
console.table(grouped);

const all = await db.article.findMany({
  select: { title: true, status: true, sourcePlatform: true, publishedAt: true },
  orderBy: { createdAt: "asc" },
});
console.log("\n=== All articles ===");
console.table(all);

await db.$disconnect();
