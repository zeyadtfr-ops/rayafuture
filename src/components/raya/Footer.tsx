"use client";

import { useState } from "react";
import { Mail, Send, Facebook, Globe, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert("تم اشتراكك بنجاح! ستصلك آخر الأخبار والإصدارات على بريدك.");
    setEmail("");
  };

  return (
    <footer className="bg-forest text-paper">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-lg font-bold mb-1">راية المستقبل</div>
              <div className="text-[10px] tracking-[0.2em] text-gold uppercase">
                RAYA · E-MAGAZINE
              </div>
            </div>
            <p className="text-sm text-paper/65 leading-relaxed mb-4">
              مجلة طلابية رقمية تهتم بقضايا التعليم والشأن الطالبي
            </p>
            <div className="text-xs font-bold mb-2 text-paper/80">
              عن المجلة
            </div>
            <p className="text-xs text-paper/60 leading-relaxed mb-4">
              راية المستقبل مجلة طلابية رقمية تعني بقضايا التعليم والأخبار
              الطلابية والأنشطة والفعاليات والفرص التعليمية.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1Duv3juc3d/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-md bg-white/5 hover:bg-gold flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Official site"
                className="h-9 w-9 rounded-md bg-white/5 hover:bg-gold flex items-center justify-center transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* روابط */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-paper/90">
              روابط
            </h4>
            <ul className="space-y-2.5 text-sm text-paper/65">
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-gold transition-colors">
                  أخبار
                </a>
              </li>
              <li>
                <a href="#articles" className="hover:text-gold transition-colors">
                  مقالات
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-gold transition-colors">
                  فعاليات
                </a>
              </li>
              <li>
                <a href="#opportunities" className="hover:text-gold transition-colors">
                  فرص تعليمية
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gold transition-colors">
                  هيئة التحرير
                </a>
              </li>
            </ul>
          </div>

          {/* الأقسام */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-paper/90">
              الأقسام
            </h4>
            <ul className="space-y-2.5 text-sm text-paper/65">
              <li>
                <a href="#news" className="hover:text-gold transition-colors">
                  أخبار
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-gold transition-colors">
                  أنشطة طلابية
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-gold transition-colors">
                  تربية وتعليم
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-gold transition-colors">
                  حوار
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-gold transition-colors">
                  رأي
                </a>
              </li>
              <li>
                <a href="#opportunities" className="hover:text-gold transition-colors">
                  فرص تعليمية
                </a>
              </li>
            </ul>
          </div>

          {/* تواصل */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-paper/90">
              تواصل
            </h4>
            <ul className="space-y-2.5 text-sm text-paper/65">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a
                  href="mailto:raya@example.edu.eg"
                  className="hover:text-gold transition-colors"
                  dir="ltr"
                >
                  raya@example.edu.eg
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  نموذج التواصل
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  أرسل مقالاً
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>

            {/* Subscribe form */}
            <form onSubmit={subscribe} className="mt-6">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-paper placeholder:text-paper/40 text-sm rounded-r-md focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold/90 text-white px-4 rounded-l-md transition-colors"
                  aria-label="اشترك"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-paper/55">
          <div>© راية المستقبل — جميع الحقوق محفوظة.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold transition-colors">
              سياسة الخصوصية
            </a>
            <span className="opacity-30">·</span>
            <a href="#" className="hover:text-gold transition-colors">
              الشروط
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
