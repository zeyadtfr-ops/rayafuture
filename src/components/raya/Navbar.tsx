"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, ChevronDown, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "#home" },
  { label: "أخبار", href: "#news" },
  { label: "مقالات", href: "#articles" },
  { label: "أنشطة", href: "#activities" },
  { label: "فعاليات", href: "#events" },
  { label: "فرص", href: "#opportunities" },
  { label: "من نحن", href: "#about" },
];

const SECTIONS = [
  { label: "أخبار", count: 17 },
  { label: "أنشطة طلابية", count: 9 },
  { label: "تربية وتعليم", count: 3 },
  { label: "حوار", count: 4 },
  { label: "رأي", count: 1 },
  { label: "فرص تعليمية", count: 0 },
  { label: "فعاليات", count: 0 },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "bg-forest text-paper border-b border-white/5",
        scrolled && "shadow-lg shadow-black/20"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight">
                راية المستقبل
              </span>
              <span className="text-[9px] tracking-[0.2em] text-gold uppercase font-medium">
                RAYA · E-MAGAZINE
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-paper/85 hover:text-gold transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="hidden md:flex h-9 px-3 items-center gap-1.5 rounded-md bg-gold/10 text-gold hover:bg-gold/20 transition-colors text-sm font-medium"
              aria-label="دخول"
            >
              <LogIn className="h-4 w-4" />
              دخول
            </a>
            <button
              className="lg:hidden text-paper p-2"
              onClick={() => setOpen((s) => !s)}
              aria-label="القائمة"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sections sub-bar */}
      <div className="hidden lg:block border-t border-white/5 bg-forest/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 h-10 overflow-x-auto">
            <span className="text-xs text-paper/60 px-2 whitespace-nowrap">
              الأقسام:
            </span>
            {SECTIONS.map((s) => (
              <a
                key={s.label}
                href="#sections"
                className="text-xs text-paper/75 hover:text-gold px-2 py-1 rounded transition-colors whitespace-nowrap flex items-center gap-1"
              >
                {s.label}
                <span className="text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 rounded">
                  {s.count}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-forest border-t border-white/5">
          <nav className="container mx-auto px-4 py-3 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-paper/90 hover:text-gold text-sm border-b border-white/5 last:border-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-3 mx-3 mb-2 h-10 rounded-md bg-gold/15 text-gold text-sm font-medium flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              دخول
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
