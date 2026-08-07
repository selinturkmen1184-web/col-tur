import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coltur.com.tr"),
  title: "Antalya Turları 2026 | Günübirlik Tur & Tekne | Col Tur",
  description: "Antalya turları 2026: şehir, tekne, rafting, Suluada ve günübirlik tur seçeneklerini karşılaştırın. Transfer ve kesin fiyatı Col Tur ile teyit edin.",
  alternates: { canonical: "/", languages: { "tr-TR": "/", "x-default": "/" } },
  robots: { index: true, follow: true },
  icons: {
    icon: "/coltur-logo.jpg",
    apple: "/coltur-logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Col Tur",
    title: "Antalya Turları 2026 | Günübirlik Tur & Tekne | Col Tur",
    description: "Antalya şehir, tekne, Suluada, rafting ve kültür turlarını karşılaştır; yerel ekiple müsaitliği teyit et.",
    images: [{ url: "/og-v2.png", width: 1200, height: 630, alt: "Col Tur Antalya turları" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antalya Turları 2026 | Col Tur",
    description: "Antalya çıkışlı günübirlik, şehir ve tekne turlarını keşfet.",
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
