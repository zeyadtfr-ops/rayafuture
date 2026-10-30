import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حياة الطالب في راية",
  description: "اكتشف كل ما يحدث في معهد راية — الأخبار، الإنجازات، الأنشطة، الفعاليات، والإعلانات المهمة في مكان واحد.",
  alternates: { canonical: "/student-life" },
  openGraph: {
    title: "حياة الطالب في راية — مجلة راية المستقبل",
    description: "أخبار المعهد، إنجازات الطلاب، الأنشطة الطلابية، الفعاليات، معرض الصور، والإعلانات.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function StudentLifeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
