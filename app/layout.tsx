import type { Metadata, Viewport } from "next";
import { BRAND, COPY } from "@/lib/config";
import { Pixels } from "@/components/Pixels";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: `${BRAND.name} · ${COPY.hero.headline}`,
  description: COPY.hero.subhook,
  openGraph: {
    title: `${BRAND.name} · ${COPY.hero.headline}`,
    description: COPY.hero.subhook,
    type: "website",
    locale: "es_GT",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} · ${COPY.hero.headline}`,
    description: COPY.hero.subhook,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Pixels />
        {children}
      </body>
    </html>
  );
}
