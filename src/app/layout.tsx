import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Mrs_Saint_Delafield, Roboto_Flex } from "next/font/google";
import { SiteHeader } from "@/site/site-header";
import { site } from "@/site/config";
import { Providers } from "@/site/providers";
import "./globals.css";

// Bricolage Grotesque sets text and display. It is variable on weight, width and optical size, so the
// hero and variable proximity can swell its weight live. Geist Mono sets code and labels.
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["opsz", "wdth"] });
// Only the faces in the first screen are preloaded; the rest load when a page uses them.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
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
    { media: "(prefers-color-scheme: light)", color: "#F2EFE8" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

// Runs before first paint so the saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("tl-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${geistMono.variable} ${robotoFlex.variable} ${script.variable}`}>
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
        </Providers>
      </body>
    </html>
  );
}
