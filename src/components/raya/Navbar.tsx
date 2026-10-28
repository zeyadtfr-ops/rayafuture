"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, Facebook, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "#home" },
  { label: "عن المجلة", href: "#about" },
  { label: "كلمات القيادات", href: "#leadership" },
  { label: "الأقسام", href: "#sections" },
  { label: "الإصدارات", href: "#issues" },
  { label: "المعرض", href: "#gallery" },
  { label: "شارك معنا", href: "#contribute" },
  { label: "تواصل معنا", href: "#contact" },
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
        scrolled
          ? "bg-[#0A382F]/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-[#0A382F]"
      )}
    >
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-white/10 bg-[#063528]">
        <div className="container mx-auto px-4 flex items-center justify-between py-2 text-[12px] text-white/70">
          <div className="flex items-center gap-4">
            <span>معهد راية العالي</span>
            <span className="opacity-40">|</span>
            <span>العدد الأول — أكتوبر ٢٠٢٦</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="opacity-70">تابعنا:</span>
            <a
              href="https://www.facebook.com/share/1Duv3juc3d/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white/70 hover:text-[#E69744] transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            {[Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="text-white/70 hover:text-[#E69744] transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative h-14 w-14 rounded-full overflow-hidden shadow-md shadow-black/20 ring-2 ring-[#E69744]/40 bg-white">
              <img
                src="/raya-logo.jpeg"
                alt="شعار راية المستقبل"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="heading-display text-white text-xl">راية المستقبل</span>
              <span className="text-[10px] tracking-[0.2em] text-[#E69744] uppercase font-medium">
                RAYA FUTURE
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[14px] font-medium text-white/85 hover:text-white relative group rounded-md transition-colors"
              >
                {item.label}
                <span className="absolute bottom-1 right-1/2 translate-x-1/2 h-[2px] w-0 bg-[#E69744] transition-all duration-300 group-hover:w-[60%]" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hidden md:flex"
              aria-label="بحث"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              asChild
              className="hidden md:inline-flex bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold h-9 px-4 rounded-md"
            >
              <a href="#contribute">
                <Send className="h-4 w-4 ml-1" />
                شارك معنا
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setOpen((s) => !s)}
              aria-label="القائمة"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#063528] border-t border-white/10">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1 max-h-[calc(100vh-72px)] overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-white/90 hover:bg-white/10 hover:text-[#E69744] rounded-md text-[15px] font-medium border-b border-white/5 last:border-0"
              >
                {item.label}
              </a>
            ))}
            <Button
              asChild
              className="mt-3 bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold"
            >
              <a href="#contribute" onClick={() => setOpen(false)}>
                <Send className="h-4 w-4 ml-1" />
                شارك معنا
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
