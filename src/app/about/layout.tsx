import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن المعهد",
  description:
    "معهد راية العالي للإدارة والتجارة الخارجية بدمياط الجديدة — صرح تعليمي تحت إشراف وزارة التعليم العالي، تأسس بالقرار الوزاري رقم ٤١٥١ لسنة ٢٠١٨.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "عن معهد راية العالي",
    description: "تعرف على رؤية المعهد ورسالته وأقسامه الأكاديمية وبرامج البكالوريوس المعتمدة.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
