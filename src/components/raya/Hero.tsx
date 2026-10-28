"use client";

import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0A382F] min-h-[88vh] flex items-center"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#0A382F] via-[#0A382F] to-[#06241D]" />

        {/* Arabesque pattern overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern
              id="hero-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0 L80 40 L40 80 L0 40 Z"
                fill="none"
                stroke="#E69744"
                strokeWidth="0.6"
              />
              <circle cx="40" cy="40" r="14" fill="none" stroke="#FBF4ED" strokeWidth="0.4" />
              <circle cx="40" cy="40" r="4" fill="#E69744" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>

        {/* Decorative big circles */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#115B46]/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[520px] h-[520px] rounded-full bg-[#E69744]/15 blur-3xl" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A382F] via-transparent to-[#0A382F]/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Text column */}
          <div className="lg:col-span-7 fade-up">
            {/* Issue badge */}
            <div className="inline-flex items-center gap-2 bg-[#E69744]/15 border border-[#E69744]/40 text-[#E69744] rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wide mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              العدد الأول — أكتوبر ٢٠٢٦
            </div>

            {/* Main title */}
            <h1 className="heading-display text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-6">
              راية
              <span className="block text-[#E69744]">المستقبل</span>
            </h1>

            {/* Tagline */}
            <p className="heading-display text-[#FBF4ED]/95 text-2xl sm:text-3xl leading-relaxed mb-4 max-w-xl">
              «كُلُّ يَنْبُوعِ عِلْمٍ.. مَلاذُ الطُّلَّابِ»
            </p>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              منصة رقمية تنقل صوت الطلاب وحكاية معهد راية العالي للإدارة والتجارة الخارجية —
              صرح تعليمي تحت إشراف وزارة التعليم العالي، يمنح درجة البكالوريوس في التجارة
              المعادلة لدرجات الجامعات المصرية، في رحلة معرفية متكاملة.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold rounded-md h-12 px-7 text-[15px] shadow-lg shadow-[#E69744]/20"
              >
                <a href="#about">
                  تعرَّف على المزيد
                  <ArrowLeft className="h-4 w-4 mr-1" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-bold rounded-md h-12 px-7 text-[15px]"
              >
                <a href="#issues">
                  <BookOpen className="h-4 w-4 ml-2" />
                  العدد الحالي
                </a>
              </Button>
            </div>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: "٣", l: "برامج بكالوريوس" },
                { n: "١٣٢", l: "ساعة معتمدة" },
                { n: "٢٠١٨", l: "سنة التأسيس" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="text-center bg-white/5 border border-white/10 rounded-lg py-3 px-2"
                >
                  <div className="heading-display text-2xl text-[#E69744]">{s.n}</div>
                  <div className="text-[11px] text-white/70 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Magazine cover mockup column */}
          <div className="lg:col-span-5 fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative mx-auto max-w-sm">
              {/* Glow */}
              <div className="absolute -inset-6 bg-[#E69744]/20 blur-3xl rounded-full" />

              {/* Cover card */}
              <div className="relative bg-gradient-to-b from-[#115B46] to-[#0A382F] rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden aspect-[3/4]">
                {/* Top stripe */}
                <div className="absolute top-0 inset-x-0 bg-[#E69744] h-2" />

                {/* Cover pattern */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.1]"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <defs>
                    <pattern
                      id="cover-pat"
                      x="0"
                      y="0"
                      width="60"
                      height="60"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M30 0 L60 30 L30 60 L0 30 Z"
                        fill="none"
                        stroke="#FBF4ED"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cover-pat)" />
                </svg>

                {/* Cover content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-[10px] tracking-[0.3em] text-[#E69744] font-bold mb-4">
                    RAYA FUTURE · 01
                  </div>
                  <div className="w-16 h-0.5 bg-[#E69744] mb-8" />

                  <div className="heading-display text-white text-5xl leading-tight mb-3">
                    راية
                    <span className="block text-[#E69744] mt-1">المستقبل</span>
                  </div>

                  <div className="text-white/60 text-xs mt-6 leading-relaxed max-w-[200px]">
                    مجلة طلابية إلكترونية تنقل صوت الطلاب وحكاية المعهد
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-white/50 text-[10px]">
                    <div className="w-8 h-0.5 bg-white/30" />
                    أكتوبر ٢٠٢٦
                    <div className="w-8 h-0.5 bg-white/30" />
                  </div>
                </div>

                {/* Bottom corner accents */}
                <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-[#E69744]/50" />
                <div className="absolute bottom-3 left-3 w-10 h-10 border-l-2 border-b-2 border-[#E69744]/50" />
                <div className="absolute top-3 right-3 w-10 h-10 border-r-2 border-t-2 border-[#E69744]/50" />
                <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-[#E69744]/50" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-[#FBF4ED] rounded-full shadow-xl px-4 py-2 flex items-center gap-2 border border-[#E69744]/30">
                <BookOpen className="h-4 w-4 text-[#0A382F]" />
                <span className="text-[#0A382F] font-bold text-sm">العدد الجديد</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-[40px]"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z"
            fill="#FBF4ED"
          />
        </svg>
      </div>
    </section>
  );
}
