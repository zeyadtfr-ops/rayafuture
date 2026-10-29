"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, ArrowUpRight, Calendar, MapPin } from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string;
  coverImage: string | null;
  status: string;
  sourceUrl: string | null;
  publishedAt: string | null;
  originalPubAt: string | null;
  createdAt: string;
  tags: string | null;
};

const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const AR_DATE_SHORT = new Intl.DateTimeFormat("ar-EG", {
  month: "long",
  day: "numeric",
});

function formatDate(a: Article) {
  const d = a.publishedAt || a.originalPubAt || a.createdAt;
  try {
    return AR_DATE.format(new Date(d));
  } catch {
    return "";
  }
}

function formatDay(a: Article) {
  const d = a.publishedAt || a.originalPubAt || a.createdAt;
  try {
    return new Intl.DateTimeFormat("ar-EG", { day: "numeric" }).format(new Date(d));
  } catch {
    return "";
  }
}

function formatMonth(a: Article) {
  const d = a.publishedAt || a.originalPubAt || a.createdAt;
  try {
    return new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(new Date(d));
  } catch {
    return "";
  }
}

function excerpt(a: Article) {
  return a.excerpt || (a.body || "").slice(0, 140) + "...";
}

function img(a: Article) {
  return a.coverImage || "/images/news-economics.jpg";
}

function useArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/articles?limit=100");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.items)) {
          setItems(data.items);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "أخبار": "آخر الأخبار الطلابية والمدرسية",
  "أنشطة طلابية": "متابعة لأنشطة الطلاب والأندية",
  "تربية وتعليم": "قضايا التعليم والممارسات التربوية",
  "حوار": "لقاءات مع شخصيات طلابية ومدرسية",
  "رأي": "مقالات رأي الطالب",
  "فرص تعليمية": "منح ودورات تدريبية وفرص للطلاب",
  "الفعاليات والمؤتمرات": "تغطية الفعاليات والمناسبات",
  "إنجازات الطلاب": "تكريمات ومشروعات وطلاب متميزون",
  "المسابقات والجوائز": "مسابقات وجوائز للطلاب",
  "مبادرات طلابية": "مبادرات وأندية طلابية",
  "إعلانات رسمية": "إعلانات رسمية من إدارة المعهد",
};

// Section title component
function SectionTitle({
  title,
  showAll = true,
}: {
  title: string;
  showAll?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl md:text-4xl font-bold text-forest">
        {title}
      </h2>
      {showAll && (
        <a
          href="#"
          className="text-sm text-gold hover:underline flex items-center gap-1 font-medium"
        >
          عرض الكل
          <ArrowLeft className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

export default function MagazineSections() {
  const { items, loading } = useArticles();

  // Group by category
  const news = items.filter((a) => a.category === "أخبار");
  const activities = items.filter((a) => a.category === "أنشطة طلابية");
  const edu = items.filter((a) => a.category === "تربية وتعليم");
  const interviews = items.filter((a) => a.category === "حوار");
  const opinions = items.filter((a) => a.category === "رأي");
  const opportunities = items.filter(
    (a) =>
      a.category === "فرص تعليمية" || a.category === "المسابقات والجوائز"
  );
  const events = items.filter(
    (a) => a.category === "الفعاليات والمؤتمرات"
  );
  const achievements = items.filter(
    (a) =>
      a.category === "إنجازات الطلاب" || a.category === "مبادرات طلابية"
  );

  const featured = items.slice(0, 3); // top 3 for "القصة الرئيسية"
  const latest = items.slice(0, 6); // top 6 for "أحدث المقالات"
  const mostRead = items.slice(0, 5); // top 5 for "الأكثر قراءة"

  // Build categories for "تصفّح حسب القسم"
  const categoryCounts: Record<string, number> = {};
  items.forEach((a) => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });
  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    desc: CATEGORY_DESCRIPTIONS[name] || "",
  }));

  return (
    <>
      {/* ────────────── القصة الرئيسية ────────────── */}
      <section className="bg-paper py-12 border-b border-border-warm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-ink/60 tracking-wider uppercase">
              القصة الرئيسية
            </h2>
            <a
              href="#"
              className="text-sm text-gold hover:underline flex items-center gap-1 font-medium"
            >
              كل الأخبار
              <ArrowLeft className="h-3.5 w-3.5" />
            </a>
          </div>

          {loading ? (
            <div className="text-center text-ink/40 py-8">جارٍ التحميل...</div>
          ) : featured.length === 0 ? (
            <div className="text-center text-ink/40 py-8">لا توجد مقالات</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((a, i) => (
                <a
                  key={a.id}
                  href={a.sourceUrl || "#"}
                  target={a.sourceUrl ? "_blank" : undefined}
                  rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                  className="group block bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-forest">
                    <img
                      src={img(a)}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      eager={true}
                    />
                    <div className="absolute top-3 right-3 bg-gold text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {a.category}
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-5">
                    <div className="text-[11px] text-ink/60 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(a)}
                    </div>
                    <h3 className="text-lg font-bold text-forest leading-snug mb-2 group-hover:text-gold transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-sm text-ink/70 leading-relaxed line-clamp-3">
                      {excerpt(a)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────── أحدث المقالات ────────────── */}
      <section id="news" className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <SectionTitle title="أحدث المقالات" />
          {loading ? (
            <div className="text-center text-ink/40 py-8">جارٍ التحميل...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((a) => (
                <a
                  key={a.id}
                  href={a.sourceUrl || "#"}
                  target={a.sourceUrl ? "_blank" : undefined}
                  rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                  className="group block bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 overflow-hidden bg-forest">
                    <img
                      src={img(a)}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      eager={true}
                    />
                    <div className="absolute top-3 right-3 bg-gold text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {a.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-ink/60 mb-1.5">
                      {formatDate(a)}
                    </div>
                    <h3 className="text-base font-bold text-forest leading-snug mb-1.5 group-hover:text-gold transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-[13px] text-ink/70 leading-relaxed line-clamp-2">
                      {excerpt(a)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────── الأكثر قراءة + فعاليات قادمة ────────────── */}
      <section className="bg-paper-warm py-12 border-y border-border-warm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* الأكثر قراءة */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-forest mb-6">
                الأكثر قراءة
              </h2>
              <div className="space-y-3">
                {mostRead.map((a, i) => (
                  <a
                    key={a.id}
                    href={a.sourceUrl || "#"}
                    target={a.sourceUrl ? "_blank" : undefined}
                    rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-4 p-3 rounded-md hover:bg-white/60 transition-colors"
                  >
                    <span className="text-3xl font-bold text-gold/40 leading-none flex-shrink-0 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-forest mb-1 group-hover:text-gold transition-colors line-clamp-1">
                        {a.title}
                      </h3>
                      <div className="text-xs text-ink/60">
                        {a.category} · {formatDate(a)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* فعاليات قادمة */}
            <div id="events">
              <h2 className="text-2xl md:text-3xl font-bold text-forest mb-6">
                فعاليات قادمة
              </h2>
              {events.length === 0 ? (
                <div className="text-sm text-ink/40 py-4">
                  لا توجد فعاليات قادمة حالياً
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 4).map((a) => (
                    <a
                      key={a.id}
                      href={a.sourceUrl || "#"}
                      target={a.sourceUrl ? "_blank" : undefined}
                      rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 p-4 bg-white rounded-md border border-border-warm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col items-center justify-center bg-forest text-paper rounded-md w-14 h-14 flex-shrink-0">
                        <span className="text-xl font-bold leading-none">
                          {formatDay(a)}
                        </span>
                        <span className="text-[10px] mt-0.5">
                          {formatMonth(a)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-forest mb-1 group-hover:text-gold transition-colors line-clamp-1">
                          {a.title}
                        </h3>
                        <p className="text-xs text-ink/70 line-clamp-2">
                          {excerpt(a)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── آخر الأخبار (شريط) ────────────── */}
      <section className="bg-brand-green text-paper py-4 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="bg-gold text-white text-xs font-bold px-3 py-1 rounded flex-shrink-0">
              آخر الأخبار
            </span>
            <div className="flex items-center gap-6 overflow-x-auto">
              {news.slice(0, 6).map((a) => (
                <a
                  key={a.id}
                  href={a.sourceUrl || "#"}
                  target={a.sourceUrl ? "_blank" : undefined}
                  rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                  className="text-sm text-paper/85 hover:text-gold whitespace-nowrap transition-colors"
                >
                  {a.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── تصفّح حسب القسم ────────────── */}
      <section id="sections" className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <SectionTitle title="تصفّح حسب القسم" />
          {categories.length === 0 ? (
            <div className="text-center text-ink/40 py-8">
              لا توجد أقسام
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <a
                  key={c.name}
                  href="#news"
                  className="group bg-white rounded-md p-5 border border-border-warm hover:border-gold hover:shadow-md transition-all"
                >
                  <div className="text-3xl font-bold text-gold mb-2">
                    {String(c.count).padStart(2, "0")}
                  </div>
                  <h3 className="text-base font-bold text-forest mb-1 group-hover:text-gold transition-colors">
                    {c.name}
                  </h3>
                  {c.desc && (
                    <p className="text-xs text-ink/60">{c.desc}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────── أنشطة طلابية + فرص تعليمية ────────────── */}
      <section
        id="activities"
        className="bg-brand-green text-paper py-12 relative overflow-hidden"
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern
              id="act-pat"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="30" fill="none" stroke="#C9A04A" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#F6F2E9" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#act-pat)" />
        </svg>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* أنشطة طلابية */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  أنشطة طلابية
                </h2>
                <a
                  href="#"
                  className="text-sm text-gold hover:underline flex items-center gap-1 font-medium"
                >
                  عرض الكل
                  <ArrowLeft className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((a) => (
                  <a
                    key={a.id}
                    href={a.sourceUrl || "#"}
                    target={a.sourceUrl ? "_blank" : undefined}
                    rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-3 p-4 bg-white/5 rounded-md hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-forest">
                      <img
                        src={img(a)}
                        alt={a.title}
                        className="w-full h-full object-cover"
                        eager={true}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold mb-1 group-hover:text-gold transition-colors line-clamp-1">
                        {a.title}
                      </h3>
                      <p className="text-xs text-paper/70 line-clamp-2">
                        {excerpt(a)}
                      </p>
                    </div>
                  </a>
                ))}
                {achievements.length === 0 && (
                  <div className="text-sm text-paper/40 py-4">
                    لا توجد أنشطة
                  </div>
                )}
              </div>
            </div>

            {/* فرص تعليمية */}
            <div id="opportunities">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  فرص تعليمية
                </h2>
                <a
                  href="#"
                  className="text-sm text-gold hover:underline flex items-center gap-1 font-medium"
                >
                  عرض الكل
                  <ArrowLeft className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="space-y-3">
                {opportunities.slice(0, 3).map((a) => (
                  <a
                    key={a.id}
                    href={a.sourceUrl || "#"}
                    target={a.sourceUrl ? "_blank" : undefined}
                    rel={a.sourceUrl ? "noopener noreferrer" : undefined}
                    className="group block p-4 bg-white/5 rounded-md hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded">
                        فرصة
                      </span>
                      <span className="text-xs text-paper/60">
                        {formatDate(a)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mb-1 group-hover:text-gold transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-paper/70 line-clamp-2">
                      {excerpt(a)}
                    </p>
                  </a>
                ))}
                {opportunities.length === 0 && (
                  <div className="text-sm text-paper/40 py-4">
                    لا توجد فرص حالياً
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── شارك في المجلة ────────────── */}
      <section id="about" className="bg-forest text-paper py-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container mx-auto px-4 relative text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل لديك قصة تستحق أن تُروى؟
          </h2>
          <p className="text-paper/75 leading-relaxed mb-6">
            أرسل مقالك لراية المستقبل، وسيقوم فريق التحرير بمراجعته. نبحث عن أصوات
            طلابية جريئة ومحتوًى أصيلاً يهم المجتمع المدرسي.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-bold px-6 py-3 rounded-md transition-colors"
          >
            أرسل مقالك
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
