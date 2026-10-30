import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع معهد راية العالي — أرسل استفساراتك واقتراحاتك عبر نموذج التواصل أو الهاتف أو البريد الإلكتروني.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "اتصل بنا — معهد راية العالي",
    description: "نموذج تواصل مباشر + معلومات الاتصال الرسمية للمعهد.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
