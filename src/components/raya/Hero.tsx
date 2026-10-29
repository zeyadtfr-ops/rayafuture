"use client";

import { ArrowLeft, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-forest text-paper relative overflow-hidden"
    >
      {/* Background decorative pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern
            id="hero-pat"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z"
              fill="none"
              stroke="#C9A04A"
              strokeWidth="0.6"
            />
            <circle cx="40" cy="40" r="14" fill="none" stroke="#F6F2E9" strokeWidth="0.4" />
            <circle cx="40" cy="40" r="4" fill="#C9A04A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-pat)" />
      </svg>

      {/* Decorative glow */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-brand-green/40 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 w-[520px] h-[520px] rounded-full bg-gold/15 blur-3xl" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs text-gold tracking-[0.2em] uppercase mb-4 font-medium">
            Higher Institute · Raya E-Magazine
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4">
            راية المستقبل
          </h1>
          <p className="text-lg sm:text-xl text-paper/80 mb-6 leading-relaxed">
            مجلة طلابية رقمية تهتم بقضايا التعليم والشأن الطالبي
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-paper/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              ٢٩ أكتوبر ٢٠٢٦
            </span>
            <span className="opacity-40">·</span>
            <a
              href="#about"
              className="hover:text-gold transition-colors"
            >
              عن المجلة
            </a>
            <span className="opacity-40">·</span>
            <a
              href="#news"
              className="hover:text-gold transition-colors"
            >
              كل الأخبار
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-[40px]"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z"
            fill="var(--paper-warm)"
          />
        </svg>
      </div>
    </section>
  );
}
