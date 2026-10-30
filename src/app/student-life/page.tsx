"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowUpRight,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Trophy,
  Users,
  Image as ImageIcon,
  Megaphone,
  Sparkles,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string;
  coverImage: string | null;
  status: string;
  publishedAt: string | null;
  originalPubAt: string | null;
  createdAt: string;
  tags: string | null;
  authorId: string | null;
};

// ─── Constants ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "all", label: "الكل", icon: Sparkles },
  { key: "news", label: "أخبار", icon: Megaphone, match: ["أخبار", "إعلانات رسمية"] },
  { key: "achievements", label: "إنجازات", icon: Trophy, match: ["إنجازات الطلاب", "المسابقات والجوائز"] },
  { key: "activities", label: "أنشطة", icon: Users, match: ["أنشطة طلابية", "مبادرات طلابية"] },
  { key: "events", label: "فعاليات", icon: Calendar, match: ["الفعاليات والمؤتمرات"] },
  { key: "announcements", label: "إعلانات", icon: AlertCircle, match: ["إعلانات رسمية", "فرص تعليمية"] },
];

const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const AR_DATE_SHORT = new Intl.DateTimeFormat("ar-EG", {
  month: "long",
  day: "numeric",
});

// ─── Helper: get fallback image by category ─────────────────────────────

function getFallbackImage(category: string): string {
  const map: Record<string, string> = {
    "أخبار": "/images/news-economics.jpg",
    "أنشطة طلابية": "/images/news-workshop.jpg",
    "مبادرات طلابية": "/images/news-environment.jpg",
    "إنجازات الطلاب": "/images/news-achievements.jpg",
    "المسابقات والجوائز": "/images/news-cultural.jpg",
    "الفعاليات والمؤتمرات": "/images/news-science-fair.jpg",
    "إعلانات رسمية": "/images/news-school-start.jpg",
    "فرص تعليمية": "/images/news-programming.jpg",
    "حوار": "/images/news-student-interview.jpg",
    "رأي": "/images/news-reading.jpg",
    "تربية وتعليم": "/images/news-study.jpg",
    "مقالات تحريرية": "/images/news-management.jpg",
  };
  return map[category] || "/images/gallery-1.jpg";
}

function img(a: Article) {
  return a.coverImage || getFallbackImage(a.category);
}

function excerpt(a: Article) {
  return a.excerpt || (a.body || "").slice(0, 140) + "...";
}

function dateOf(a: Article) {
  return a.publishedAt || a.originalPubAt || a.createdAt;
}

// ─── Category badge component ───────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block bg-gold/15 text-gold text-[11px] font-bold px-2 py-0.5 rounded">
      {category}
    </span>
  );
}

// ─── Lightbox ───────────────────────────────────────────────────────────

function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(1);
      if (e.key === "ArrowRight") onNav(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNav]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      {index > 0 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2"
          onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2"
          onClick={(e) => { e.stopPropagation(); onNav(1); }}
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}
      <img
        src={images[index]}
        alt="معرض الصور"
        className="max-w-full max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

export default function StudentLifePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [visibleCount, setVisibleCount] = useState(9);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch all published articles
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/articles?limit=100");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.items)) {
          setArticles(data.items);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let result = [...articles];

    // Category filter
    if (activeCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.key === activeCategory);
      if (cat?.match) {
        result = result.filter((a) => cat.match.includes(a.category));
      }
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt || "").toLowerCase().includes(q) ||
          (a.body || "").toLowerCase().includes(q) ||
          (a.tags || "").toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const da = new Date(dateOf(a)).getTime();
      const db = new Date(dateOf(b)).getTime();
      return sortOrder === "latest" ? db - da : da - db;
    });

    return result;
  }, [articles, activeCategory, search, sortOrder]);

  // Group articles by category for sections
  const newsArticles = articles.filter((a) =>
    ["أخبار", "إعلانات رسمية"].includes(a.category)
  );
  const achievementArticles = articles.filter((a) =>
    ["إنجازات الطلاب", "المسابقات والجوائز"].includes(a.category)
  );
  const activityArticles = articles.filter((a) =>
    ["أنشطة طلابية", "مبادرات طلابية"].includes(a.category)
  );
  const eventArticles = articles.filter((a) =>
    ["الفعاليات والمؤتمرات"].includes(a.category)
  );
  const announcementArticles = articles.filter((a) =>
    ["إعلانات رسمية", "فرص تعليمية"].includes(a.category)
  );

  // Gallery images — collect from all articles with coverImage
  const galleryImages = articles
    .filter((a) => a.coverImage)
    .map((a) => ({ src: a.coverImage!, title: a.title, date: dateOf(a) }))
    .slice(0, 12);

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-paper">
      {/* ════════════ HERO ════════════ */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="sl-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#C9A04A" strokeWidth="0.6" />
              <circle cx="40" cy="40" r="14" fill="none" stroke="#F6F2E9" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sl-pat)" />
        </svg>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">
              Student Life & Institute News
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5">
              حياة الطالب في راية
            </h1>
            <p className="text-lg sm:text-xl text-paper/80 mb-8 leading-relaxed max-w-2xl">
              اكتشف كل ما يحدث في معهد راية العالي — الأخبار، الإنجازات، الأنشطة،
              الفعاليات، والإعلانات المهمة في مكان واحد.
            </p>
            {/* Quick nav */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "أخبار", href: "#news", icon: Megaphone },
                { label: "إنجازات", href: "#achievements", icon: Trophy },
                { label: "أنشطة", href: "#activities", icon: Users },
                { label: "فعاليات", href: "#events", icon: Calendar },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-paper/80 hover:text-gold hover:border-gold/30 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* ════════════ SEARCH + FILTERS ════════════ */}
      <section className="bg-paper py-6 border-b border-border-warm sticky top-0 z-30 backdrop-blur-md bg-paper/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B66]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(9); }}
                placeholder="ابحث في الأخبار، الأنشطة، الفعاليات..."
                className="w-full h-10 pr-10 pl-4 rounded-md border border-border-warm bg-white text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A6B66] font-medium whitespace-nowrap">ترتيب:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
                className="h-10 px-3 rounded-md border border-border-warm bg-white text-sm focus:outline-none focus:border-gold"
              >
                <option value="latest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
              </select>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setVisibleCount(9); }}
                className={
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors " +
                  (activeCategory === cat.key
                    ? "bg-forest text-paper"
                    : "bg-white text-[#5A6B66] border border-border-warm hover:border-gold hover:text-forest")
                }
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ LATEST NEWS ════════════ */}
      <section id="news" className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-2 font-bold">
                Latest News
              </p>
              <h2 className="text-3xl font-bold text-forest">أحدث أخبار المعهد</h2>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#5A6B66]">جارٍ التحميل...</div>
          ) : newsArticles.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <Megaphone className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لا توجد أخبار منشورة حالياً. سيتم نشر الأخبار قريباً.</p>
            </div>
          ) : (
            <>
              {/* Featured news (first item) */}
              {newsArticles[0] && (
                <a
                  href="#"
                  className="group block bg-white rounded-xl overflow-hidden border border-border-warm hover:shadow-xl transition-shadow mb-6"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-80 overflow-hidden bg-forest">
                      <img
                        src={img(newsArticles[0])}
                        alt={newsArticles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-gold text-white text-xs font-bold px-3 py-1 rounded-md">
                          مميز
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <CategoryBadge category={newsArticles[0].category} />
                        <span className="text-xs text-[#5A6B66] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {AR_DATE.format(new Date(dateOf(newsArticles[0])))}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-forest leading-snug mb-3 group-hover:text-gold transition-colors">
                        {newsArticles[0].title}
                      </h3>
                      <p className="text-sm text-[#5A6B66] leading-relaxed mb-4 line-clamp-3">
                        {excerpt(newsArticles[0])}
                      </p>
                      <span className="inline-flex items-center text-gold font-bold text-sm">
                        اقرأ المزيد
                        <ArrowLeft className="h-4 w-4 mr-1" />
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* News grid */}
              {newsArticles.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsArticles.slice(1, 7).map((a) => (
                    <a
                      key={a.id}
                      href="#"
                      className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-44 overflow-hidden bg-forest">
                        <img
                          src={img(a)}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <CategoryBadge category={a.category} />
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-[11px] text-[#5A6B66] mb-1.5 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {AR_DATE.format(new Date(dateOf(a)))}
                        </div>
                        <h3 className="text-base font-bold text-forest leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <p className="text-[13px] text-[#5A6B66] leading-relaxed line-clamp-2">
                          {excerpt(a)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ════════════ ACHIEVEMENTS ════════════ */}
      <section id="achievements" className="bg-paper-warm py-12 border-y border-border-warm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-2 font-bold">
                Student Achievements
              </p>
              <h2 className="text-3xl font-bold text-forest">إنجازات الطلاب</h2>
            </div>
            <Trophy className="h-8 w-8 text-gold/40 hidden md:block" />
          </div>

          {achievementArticles.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <Trophy className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لم تُنشر إنجازات بعد. سيتم عرض إنجازات الطلاب المتميزين قريباً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievementArticles.map((a) => (
                <a
                  key={a.id}
                  href="#"
                  className="group bg-white rounded-lg overflow-hidden border border-border-warm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden bg-forest">
                    <img
                      src={img(a)}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
                    <div className="absolute top-3 right-3 bg-gold text-white p-1.5 rounded-full">
                      <Trophy className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-[11px] text-[#5A6B66] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {AR_DATE.format(new Date(dateOf(a)))}
                    </div>
                    <h3 className="text-base font-bold text-forest leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-[13px] text-[#5A6B66] leading-relaxed line-clamp-2">
                      {excerpt(a)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════ ACTIVITIES ════════════ */}
      <section id="activities" className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-2 font-bold">
                Student Activities
              </p>
              <h2 className="text-3xl font-bold text-forest">الأنشطة الطلابية</h2>
            </div>
            <Users className="h-8 w-8 text-gold/40 hidden md:block" />
          </div>

          {activityArticles.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <Users className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لا توجد أنشطة منشورة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {activityArticles.map((a) => (
                <a
                  key={a.id}
                  href="#"
                  className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-36 overflow-hidden bg-forest">
                    <img
                      src={img(a)}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <CategoryBadge category={a.category} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-[#5A6B66] mb-1">
                      {AR_DATE_SHORT.format(new Date(dateOf(a)))}
                    </div>
                    <h3 className="text-sm font-bold text-forest leading-snug mb-1 group-hover:text-gold transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-[#5A6B66] line-clamp-2">
                      {excerpt(a)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════ EVENTS ════════════ */}
      <section id="events" className="bg-brand-green text-paper py-12 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="ev-pat" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#C9A04A" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#F6F2E9" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ev-pat)" />
        </svg>

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-2 font-bold">
                Upcoming Events
              </p>
              <h2 className="text-3xl font-bold">الفعاليات القادمة</h2>
            </div>
            <Calendar className="h-8 w-8 text-gold/40 hidden md:block" />
          </div>

          {eventArticles.length === 0 ? (
            <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center">
              <Calendar className="h-12 w-12 text-paper/30 mx-auto mb-3" />
              <p className="text-paper/60">لا توجد فعاليات قادمة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventArticles.map((a) => {
                const eventDate = new Date(dateOf(a));
                const day = new Intl.DateTimeFormat("ar-EG", { day: "numeric" }).format(eventDate);
                const month = new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(eventDate);
                const isUpcoming = eventDate.getTime() > Date.now();
                return (
                  <a
                    key={a.id}
                    href="#"
                    className="group flex items-start gap-4 bg-white/5 rounded-lg p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    {/* Date box */}
                    <div className="flex flex-col items-center justify-center bg-forest text-paper rounded-md w-16 h-16 flex-shrink-0 border border-gold/20">
                      <span className="text-2xl font-bold leading-none">{day}</span>
                      <span className="text-[10px] mt-1">{month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {isUpcoming ? (
                          <span className="inline-flex items-center gap-1 bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded">
                            <Clock className="h-2.5 w-2.5" />
                            قادمة
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-white/10 text-paper/60 text-[10px] font-bold px-2 py-0.5 rounded">
                            منتهية
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold mb-1 group-hover:text-gold transition-colors line-clamp-1">
                        {a.title}
                      </h3>
                      <p className="text-xs text-paper/70 line-clamp-2">
                        {excerpt(a)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════════ PHOTO GALLERY ════════════ */}
      <section id="gallery" className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-2 font-bold">
                Photo Gallery
              </p>
              <h2 className="text-3xl font-bold text-forest">من داخل راية</h2>
            </div>
            <ImageIcon className="h-8 w-8 text-gold/40 hidden md:block" />
          </div>

          {galleryImages.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <ImageIcon className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لا توجد صور في المعرض حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryImages.map((g, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLightboxImages(galleryImages.map((x) => x.src));
                    setLightboxIndex(i);
                  }}
                  className="group relative aspect-square rounded-md overflow-hidden bg-forest border border-border-warm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={g.src}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-paper text-xs font-medium line-clamp-2 text-right">
                      {g.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════ ANNOUNCEMENTS ════════════ */}
      <section id="announcements" className="bg-paper-warm py-12 border-t border-border-warm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-2 font-bold">
                Announcements
              </p>
              <h2 className="text-3xl font-bold text-forest">إعلانات مهمة للطلاب</h2>
            </div>
            <AlertCircle className="h-8 w-8 text-gold/40 hidden md:block" />
          </div>

          {announcementArticles.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <AlertCircle className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لا توجد إعلانات حالياً.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcementArticles.map((a, i) => (
                <a
                  key={a.id}
                  href="#"
                  className="group flex items-start gap-4 bg-white rounded-lg p-4 border border-border-warm hover:shadow-md transition-shadow"
                >
                  <div className={
                    "flex-shrink-0 w-1 h-12 rounded-full " +
                    (i === 0 ? "bg-red-500" : i === 1 ? "bg-gold" : "bg-forest/30")
                  } />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {i === 0 && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          عاجل
                        </span>
                      )}
                      <CategoryBadge category={a.category} />
                      <span className="text-[11px] text-[#5A6B66]">
                        {AR_DATE.format(new Date(dateOf(a)))}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-forest group-hover:text-gold transition-colors line-clamp-1">
                      {a.title}
                    </h3>
                    <p className="text-xs text-[#5A6B66] line-clamp-1 mt-0.5">
                      {excerpt(a)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#5A6B66] group-hover:text-gold flex-shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════ SEARCH RESULTS (when searching) ════════════ */}
      {search.trim() && (
        <section className="bg-paper py-12 border-t border-border-warm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-forest">
                نتائج البحث ({filtered.length})
              </h2>
              <button
                onClick={() => setSearch("")}
                className="text-sm text-gold hover:underline flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                مسح البحث
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
                <Search className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
                <p className="text-[#5A6B66]">لا توجد نتائج مطابقة لبحثك.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(0, visibleCount).map((a) => (
                  <a
                    key={a.id}
                    href="#"
                    className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-40 overflow-hidden bg-forest">
                      <img src={img(a)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                        <CategoryBadge category={a.category} />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] text-[#5A6B66] mb-1.5 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {AR_DATE.format(new Date(dateOf(a)))}
                      </div>
                      <h3 className="text-base font-bold text-forest leading-snug mb-1.5 group-hover:text-gold transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="text-[13px] text-[#5A6B66] line-clamp-2">
                        {excerpt(a)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {filtered.length > visibleCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2 bg-forest hover:bg-brand-green text-paper font-bold px-6 py-2.5 rounded-md transition-colors"
                >
                  عرض المزيد
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-forest text-paper py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — حياة الطالب. جميع الحقوق محفوظة.
        </div>
      </footer>

      {/* ════════════ LIGHTBOX ════════════ */}
      {lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => { setLightboxImages([]); setLightboxIndex(0); }}
          onNav={(dir) => {
            setLightboxIndex((prev) => {
              const next = prev + dir;
              if (next < 0) return 0;
              if (next >= lightboxImages.length) return lightboxImages.length - 1;
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
