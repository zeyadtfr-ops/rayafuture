"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Video,
  Briefcase,
  GraduationCap,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  publishedAt: string | null;
  createdAt: string;
  body: string | null;
};

const RESOURCE_CATEGORIES = [
  { key: "all", label: "الكل" },
  { key: "articles", label: "مقالات تعليمية", match: ["تربية وتعليم", "مقالات تحريرية"] },
  { key: "opportunities", label: "فرص تدريبية", match: ["فرص تعليمية"] },
  { key: "guides", label: "أدلة دراسية", match: ["تربية وتعليم"] },
];

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/articles?limit=100");
        if (!res.ok) return;
        const data = await res.json();
        setArticles(data.items || []);
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = articles.filter((a) => {
    if (filter === "all") return true;
    const cat = RESOURCE_CATEGORIES.find((c) => c.key === filter);
    return cat?.match?.includes(a.category);
  });

  const AR_DATE = new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">Educational Resources</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">الموارد التعليمية</h1>
          <p className="text-lg text-paper/80 max-w-2xl">
            مقالات تعليمية، أدلة دراسية، فرص تدريبية، وموارد لمساعدتك في رحلتك الأكاديمية.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* Quick access cards */}
      <section className="bg-paper py-8 border-b border-border-warm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, title: "مقالات تعليمية", desc: "نصائح ومقالات" },
              { icon: Briefcase, title: "فرص تدريبية", desc: "دورات وورش عمل" },
              { icon: GraduationCap, title: "أدلة دراسية", desc: "إرشادات أكاديمية" },
              { icon: Video, title: "فيديوهات", desc: "محتوى مرئي" },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-border-warm text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-forest/5 mb-2">
                  <c.icon className="h-5 w-5 text-forest" />
                </div>
                <h3 className="text-sm font-bold text-forest">{c.title}</h3>
                <p className="text-xs text-[#5A6B66] mt-0.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Resources */}
      <section className="bg-paper py-12">
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {RESOURCE_CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={
                  "px-4 py-2 rounded-full text-xs font-bold transition-colors " +
                  (filter === c.key
                    ? "bg-forest text-paper"
                    : "bg-white text-[#5A6B66] border border-border-warm hover:border-gold")
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#5A6B66]">جارٍ التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <FileText className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لا توجد موارد متاحة في هذا القسم حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a) => (
                <a
                  key={a.id}
                  href={a.coverImage ? "#" : `/article/${a.id}`}
                  className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-36 overflow-hidden bg-forest">
                    {a.coverImage && (
                      <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 right-3 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {a.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-[#5A6B66] mb-1.5">
                      {AR_DATE.format(new Date(a.publishedAt || a.createdAt))}
                    </div>
                    <h3 className="text-sm font-bold text-forest leading-snug mb-1.5 group-hover:text-gold transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-[#5A6B66] line-clamp-2">{a.excerpt || ""}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-forest text-paper py-6">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — الموارد التعليمية
        </div>
      </footer>
    </div>
  );
}
