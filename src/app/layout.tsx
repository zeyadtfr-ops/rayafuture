import type { Metadata } from "next";
import { Tajawal, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مجلة راية المستقبل | منصة طلابية إلكترونية - معهد راية العالي",
  description:
    "مجلة طلابية إلكترونية تابعة لمعهد راية العالي، تنقل صوت الطلاب وحكاية المعهد. أخبار، فعاليات، إنجازات، إصدارات رقمية، ومساحة لإبداعات الطلاب.",
  keywords: [
    "راية المستقبل",
    "مجلة طلابية",
    "معهد راية العالي",
    "RAYA FUTURE",
    "مجلة إلكترونية",
    "أخبار الطلاب",
  ],
  authors: [{ name: "معهد راية العالي" }],
  openGraph: {
    title: "مجلة راية المستقبل",
    description: "منصة رقمية تنقل صوت الطلاب وحكاية المعهد",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} ${amiri.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
