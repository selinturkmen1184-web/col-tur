import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coltur.com.tr"),
  title: "Antalya Turları ve Tekne Gezileri | Col Tur",
  description: "Antalya turları, tekne gezileri, şehir ve kültür rotaları. Yerel planlama, açık fiyatlar ve hızlı müsaitlik teyidiyle Col Tur'da.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Col Tur",
    title: "Antalya Turları ve Tekne Gezileri | Col Tur",
    description: "Antalya'yı yerel gibi keşfet: şehir, tekne, doğa ve kültür turlarını karşılaştır.",
    images: [{ url: "/og-v2.png", width: 1200, height: 630, alt: "Col Tur Antalya turları" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antalya Turları ve Tekne Gezileri | Col Tur",
    description: "Antalya'yı yerel gibi keşfet.",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
