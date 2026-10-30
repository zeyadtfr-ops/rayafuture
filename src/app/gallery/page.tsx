"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

type Article = {
  id: string;
  title: string;
  coverImage: string | null;
  category: string;
  publishedAt: string | null;
  createdAt: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<{ src: string; title: string; category: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/articles?limit=100");
        if (!res.ok) return;
        const data = await res.json();
        const imgs = (data.items || [])
          .filter((a: Article) => a.coverImage)
          .map((a: Article) => ({
            src: a.coverImage!,
            title: a.title,
            category: a.category,
            date: a.publishedAt || a.createdAt,
          }));
        setImages(imgs);
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  const AR_DATE = new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="g-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" stroke="#C9A04A" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-pat)" />
        </svg>
        <div className="container mx-auto px-4 relative z-10 py-16">
          <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">Photo Gallery</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">المركز الإعلامي</h1>
          <p className="text-lg text-paper/80 max-w-2xl">معرض صور فعاليات وأنشطة معهد راية العالي</p>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-paper py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12 text-[#5A6B66]">جارٍ التحميل...</div>
          ) : images.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
              <ImageIcon className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66]">لا توجد صور في المعرض حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-forest border border-border-warm hover:shadow-lg transition-shadow"
                >
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div className="text-paper text-right">
                      <p className="text-xs font-medium line-clamp-2">{img.title}</p>
                      <p className="text-[10px] text-gold mt-1">{img.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setLightboxIndex(-1)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2" onClick={() => setLightboxIndex(-1)}>
            <X className="h-8 w-8" />
          </button>
          {lightboxIndex > 0 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}>
              <ChevronRight className="h-10 w-10" />
            </button>
          )}
          {lightboxIndex < images.length - 1 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}>
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightboxIndex].src} alt={images[lightboxIndex].title} className="max-w-full max-h-[75vh] object-contain rounded-lg mx-auto" />
            <div className="text-center mt-4">
              <p className="text-white text-sm font-medium">{images[lightboxIndex].title}</p>
              <p className="text-white/50 text-xs mt-1">{images[lightboxIndex].category} · {AR_DATE.format(new Date(images[lightboxIndex].date))}</p>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-forest text-paper py-6">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — المركز الإعلامي
        </div>
      </footer>
    </div>
  );
}
