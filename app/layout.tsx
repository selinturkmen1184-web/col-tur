import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Col Tur | Antalya'nın Yerel Rotaları",
  description: "Antalya şehir turları, tekne gezileri ve kültür rotalarını yerel rehberlerle keşfedin.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
