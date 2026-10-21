import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Mrs_Saint_Delafield, Roboto_Flex, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/site/site-header";
import { SiteFooter } from "@/site/site-footer";
import { site } from "@/site/config";
import { Providers } from "@/site/providers";
import "./globals.css";

// The site type follows supermemory.ai: Geist for text, Space Grotesk for display, Geist Mono for code and labels.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
// Only the two faces in the first screen are preloaded; the rest load when a page uses them.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", subsets: ["latin"], weight: "400", preload: false });
const robotoFlex = Roboto_Flex({ variable: "--font-roboto-flex", subsets: ["latin"], axes: ["wdth", "slnt"], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Textlab: text effects for React", template: "%s | Textlab" },
  description: site.description,
  openGraph: { title: "Textlab", description: site.description, siteName: "Textlab", type: "website" },
  alternates: { types: { "text/plain": "/llms.txt" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

// Runs before first paint so the saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("tl-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${grotesk.variable} ${robotoFlex.variable} ${script.variable}`}>
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
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
