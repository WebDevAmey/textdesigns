import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Mrs_Saint_Delafield, Roboto_Flex } from "next/font/google";
import { SiteHeader } from "@/site/site-header";
import { SiteFooter } from "@/site/site-footer";
import { site } from "@/site/config";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", subsets: ["latin"], weight: "400" });
const robotoFlex = Roboto_Flex({ variable: "--font-roboto-flex", subsets: ["latin"], axes: ["wdth", "opsz", "slnt", "GRAD"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Textlab: text effects for React", template: "%s | Textlab" },
  description: site.description,
  openGraph: { title: "Textlab", description: site.description, siteName: "Textlab", type: "website" },
  alternates: { types: { "text/plain": "/llms.txt" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1917" },
  ],
};

// Runs before first paint so the saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("tl-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${instrument.variable} ${robotoFlex.variable} ${script.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
