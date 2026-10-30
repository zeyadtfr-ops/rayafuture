import type { Metadata, Viewport } from "next";
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rayafuture.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#032B22",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "مجلة راية المستقبل | منصة طلابية إلكترونية - معهد راية العالي",
    template: "%s | راية المستقبل",
  },
  description:
    "مجلة طلابية إلكترونية تابعة لمعهد راية العالي للإدارة والتجارة الخارجية. أخبار، فعاليات، إنجازات طلابية، أنشطة، فرص تعليمية، ومساحة لإبداعات الطلاب.",
  keywords: [
    "راية المستقبل",
    "مجلة طلابية",
    "معهد راية العالي",
    "معهد راية العالي للإدارة والتجارة الخارجية",
    "RAYA FUTURE",
    "مجلة إلكترونية",
    "أخبار الطلاب",
    "دمياط الجديدة",
    "التعليم العالي",
    "بكالوريوس تجارة",
  ],
  authors: [{ name: "معهد راية العالي", url: "https://raya.edu.eg" }],
  creator: "معهد راية العالي",
  publisher: "معهد راية العالي",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "ar-EG": baseUrl,
    },
  },
  openGraph: {
    title: "مجلة راية المستقبل — راية المستقبل",
    description:
      "منصة رقمية تنقل صوت الطلاب وحكاية معهد راية العالي. أخبار، فعاليات، إنجازات، أنشطة، وفرص تعليمية.",
    type: "website",
    locale: "ar_EG",
    siteName: "راية المستقبل",
    url: baseUrl,
    images: [
      {
        url: "/images/hero-campus.jpg",
        width: 1200,
        height: 630,
        alt: "مجلة راية المستقبل — معهد راية العالي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مجلة راية المستقبل",
    description:
      "منصة رقمية تنقل صوت الطلاب وحكاية معهد راية العالي للإدارة والتجارة الخارجية.",
    images: ["/images/hero-campus.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  category: "education",
};

// JSON-LD structured data for the organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "معهد راية العالي للإدارة والتجارة الخارجية",
  alternateName: "Raya Higher Institute of Administration and Foreign Trade",
  description:
    "صرح تعليمي تحت إشراف وزارة التعليم العالي، تأسس بالقرار الوزاري رقم ٤١٥١ لسنة ٢٠١٨.",
  url: baseUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "دمياط الجديدة",
    addressCountry: "EG",
    streetAddress: "الحي الثاني، أمام نادي المستقبل",
  },
  telephone: "+201030830822",
  email: "rayaedu2@gmail.com",
  foundingDate: "2018",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "راية المستقبل — Raya Future E-Magazine",
  alternateName: "RAYA · E-MAGAZINE",
  url: baseUrl,
  inLanguage: "ar-EG",
  publisher: {
    "@type": "EducationalOrganization",
    name: "معهد راية العالي للإدارة والتجارة الخارجية",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
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
