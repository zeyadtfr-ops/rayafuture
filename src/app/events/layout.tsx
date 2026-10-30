import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الفعاليات والتقويم",
  description: "تابع فعاليات معهد راية العالي — مؤتمرات، ورش عمل، مسابقات، ورحلات طلابية في تقويم تفاعلي واحد.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "الفعاليات والتقويم — معهد راية العالي",
    description: "تقويم تفاعلي لفعاليات المعهد القادمة والمنتهية.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
