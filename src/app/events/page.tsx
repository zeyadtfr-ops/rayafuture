"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string;
  coverImage: string | null;
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

const AR_TIME = new Intl.DateTimeFormat("ar-EG", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function dateOf(a: Article) {
  return a.publishedAt || a.originalPubAt || a.createdAt;
}

function img(a: Article) {
  return a.coverImage || "/images/news-science-fair.jpg";
}

function excerpt(a: Article) {
  return a.excerpt || (a.body || "").slice(0, 140) + "...";
}

export default function EventsPage() {
  const [events, setEvents] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/articles?limit=100");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.items)) {
          // Filter only events
          const eventArticles = data.items.filter(
            (a: Article) => a.category === "الفعاليات والمؤتمرات"
          );
          setEvents(eventArticles);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const now = Date.now();

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => {
      const eventTime = new Date(dateOf(e)).getTime();
      if (filter === "upcoming") return eventTime >= now;
      return eventTime < now;
    });
  }, [events, filter, now]);

  // Calendar days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Events this month
  const eventsThisMonth = events.filter((e) => {
    const d = new Date(dateOf(e));
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const dayNames = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  return (
    <div className="min-h-screen bg-paper">
      {/* ════════════ HERO ════════════ */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="ev-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="20" fill="none" stroke="#C9A04A" strokeWidth="0.6" />
              <circle cx="40" cy="40" r="8" fill="#C9A04A" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ev-pat)" />
        </svg>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">
              Events & Calendar
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] mb-5">
              الفعاليات والتقويم
            </h1>
            <p className="text-lg text-paper/80 mb-8 leading-relaxed max-w-2xl">
              تابع فعاليات المعهد من مؤتمرات وورش عمل ومسابقات ورحلات طلابية في مكان واحد.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* ════════════ CALENDAR + EVENTS ════════════ */}
      <section className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border-warm p-6 sticky top-6">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    className="p-2 rounded-md hover:bg-paper-warm transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-forest" />
                  </button>
                  <h3 className="text-lg font-bold text-forest">
                    {monthNames[month]} {year}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    className="p-2 rounded-md hover:bg-paper-warm transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-forest" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-[10px] font-bold text-[#5A6B66] py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = eventsThisMonth.filter((e) => {
                      const ed = new Date(dateOf(e));
                      return ed.getDate() === day;
                    });
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                    return (
                      <div
                        key={day}
                        className={
                          "aspect-square flex flex-col items-center justify-center rounded-md text-sm relative " +
                          (isToday
                            ? "bg-forest text-paper font-bold"
                            : dayEvents.length > 0
                            ? "bg-gold/10 text-forest font-bold"
                            : "text-[#5A6B66] hover:bg-paper-warm")
                        }
                      >
                        {day}
                        {dayEvents.length > 0 && (
                          <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-gold" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-border-warm flex items-center gap-4 text-xs text-[#5A6B66]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    فعالية
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-forest" />
                    اليوم
                  </span>
                </div>
              </div>
            </div>

            {/* Events list */}
            <div className="lg:col-span-2">
              {/* Filter tabs */}
              <div className="flex gap-2 mb-6">
                {[
                  { key: "all", label: "الكل" },
                  { key: "upcoming", label: "قادمة" },
                  { key: "past", label: "منتهية" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key as any)}
                    className={
                      "px-4 py-2 rounded-md text-sm font-bold transition-colors " +
                      (filter === f.key
                        ? "bg-forest text-paper"
                        : "bg-white text-[#5A6B66] border border-border-warm hover:border-gold")
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Events */}
              {loading ? (
                <div className="text-center py-12 text-[#5A6B66]">جارٍ التحميل...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
                  <Calendar className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
                  <p className="text-[#5A6B66]">
                    {filter === "upcoming"
                      ? "لا توجد فعاليات قادمة حالياً."
                      : filter === "past"
                      ? "لا توجد فعاليات منتهية."
                      : "لا توجد فعاليات منشورة حالياً."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((e) => {
                    const eventDate = new Date(dateOf(e));
                    const isUpcoming = eventDate.getTime() >= now;
                    const day = new Intl.DateTimeFormat("ar-EG", { day: "numeric" }).format(eventDate);
                    const monthName = new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(eventDate);

                    return (
                      <a
                        key={e.id}
                        href="#"
                        className="group flex items-stretch gap-4 bg-white rounded-xl overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                      >
                        {/* Date block */}
                        <div className={
                          "flex flex-col items-center justify-center w-20 flex-shrink-0 " +
                          (isUpcoming ? "bg-forest" : "bg-[#5A6B66]/20")
                        }>
                          <span className={"text-2xl font-bold leading-none " + (isUpcoming ? "text-paper" : "text-[#5A6B66]")}>
                            {day}
                          </span>
                          <span className={"text-[10px] mt-1 " + (isUpcoming ? "text-gold" : "text-[#5A6B66]")}>
                            {monthName}
                          </span>
                          <span className={"text-[9px] mt-0.5 " + (isUpcoming ? "text-paper/60" : "text-[#5A6B66]/60")}>
                            {eventDate.getFullYear()}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {isUpcoming ? (
                              <span className="inline-flex items-center gap-1 bg-gold/15 text-gold text-[10px] font-bold px-2 py-0.5 rounded">
                                <Clock className="h-2.5 w-2.5" />
                                قادمة
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#5A6B66]/10 text-[#5A6B66] text-[10px] font-bold px-2 py-0.5 rounded">
                                منتهية
                              </span>
                            )}
                            <span className="text-[11px] text-[#5A6B66] flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {AR_TIME.format(eventDate)}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-forest mb-1 group-hover:text-gold transition-colors line-clamp-1">
                            {e.title}
                          </h3>
                          <p className="text-xs text-[#5A6B66] line-clamp-2 leading-relaxed">
                            {excerpt(e)}
                          </p>
                        </div>

                        {/* Image */}
                        <div className="hidden sm:block w-28 flex-shrink-0 overflow-hidden bg-forest">
                          <img
                            src={img(e)}
                            alt={e.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-forest text-paper py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — الفعاليات. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
