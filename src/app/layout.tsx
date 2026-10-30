import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

const heading = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-heading",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Enquanto o site não estiver pronto, nada deve ser indexado.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="text-body flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
