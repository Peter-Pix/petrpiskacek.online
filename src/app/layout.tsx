import type { Metadata } from "next";
import "./globals.css";

const defaultUrl = "https://petrpiskacek.online";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Petr Piskáček — příběh, vize, proč to dělám",
  description:
    "Nejsem tady, abych ti prodal AI. Jsem tady, abych ti ukázal, co s ní jde dělat. A proč si myslím, že to má smysl.",
  keywords: [
    "Petr Piskáček",
    "AI příběh",
    "AI vize",
    "proč AI",
    "umělá inteligence",
    "automatizace",
    "člověk za AI",
  ],
  authors: [{ name: "Petr Piskáček" }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Petr Piskáček — příběh, vize, proč to dělám",
    description: "Nejsem tady, abych ti prodal AI. Jsem tady, abych ti ukázal, co s ní jde dělat.",
    type: "website",
    locale: "cs_CZ",
    url: defaultUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Petr Piskáček — příběh, vize, proč to dělám",
    description: "Nejsem tady, abych ti prodal AI. Jsem tady, abych ti ukázal, co s ní jde dělat.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-gold/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
