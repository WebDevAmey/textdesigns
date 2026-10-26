"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";
import { BlurReveal } from "@registry/textlab/blur-reveal/blur-reveal";
import { useReduced } from "@registry/textlab/lib/use-reduced";
import { ThemeToggle } from "../theme-toggle";
import { site } from "../config";
import { Magnetic } from "./magnetic";
import { Wordmark } from "./wordmark";

const groups = [
  { title: "Library", links: [{ href: "/components", label: "Components" }, { href: "/guides", label: "Guides" }, { href: "/docs/faq", label: "FAQ" }, { href: "/docs/changelog", label: "Changelog" }] },
  { title: "AI", links: [{ href: "/docs/ai", label: "AI docs" }, { href: "/llms.txt", label: "llms.txt" }, { href: "/docs/ai#mcp", label: "MCP" }, { href: "/index.md", label: "Markdown" }] },
  { title: "Project", links: [{ href: site.github, label: "GitHub" }, { href: "/docs/installation", label: "Installation" }, { href: "/roadmap", label: "Roadmap" }] },
];

/**
 * The closing shot. The page above scrolls away like a curtain and this sits fixed underneath it,
 * one viewport tall: the call to action, the links, and the wordmark rising into place.
 */
export function CinematicFooter({ total, star }: { total: number; star: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["25%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);
  const tracking = useTransform(scrollYProgress, [0, 1], ["-0.045em", "-0.06em"]);

  return (
    <footer ref={ref} className="relative h-[100svh] min-h-[640px]" style={{ clipPath: "inset(0)" }}>
      {/* The footer sits under the page, so keyboard focus inside it scrolls the curtain fully open. */}
      <div
        className="fixed inset-x-0 bottom-0 flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-[var(--tl-surface)]"
        onFocus={() => window.scrollTo({ top: document.documentElement.scrollHeight })}
      >

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pt-[calc(var(--header-h)+16px)] sm:pt-[calc(var(--header-h)+40px)] sm:px-10">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
            <div className="lg:col-span-7">
              <BlurReveal as="h2" text="Start typing." trigger="inView" className="font-display text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]" />
              <p className="mt-4 text-lg text-secondary">Pick an effect, run one command.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                <Magnetic>
                  <Link href="/components" className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-base font-semibold text-accent-foreground transition-transform duration-200 active:scale-[0.98]">
                    Browse all {total} effects
                  </Link>
                </Magnetic>
                <Magnetic>{star}</Magnetic>
              </div>
            </div>
            <nav aria-label="Footer" className="grid grid-cols-3 gap-6 lg:col-span-5">
              {groups.map((g) => (
                <div key={g.title}>
                  <h3 className="label-mono text-tertiary">{g.title}</h3>
                  <ul className="mt-2 sm:mt-3">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} className="inline-flex min-h-7 items-center text-sm text-secondary transition-colors duration-200 hover:text-foreground">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--hairline)] py-3">
            <p className="label-mono text-tertiary">MIT licensed. Built with motion and React.</p>
            <div className="flex items-center gap-2">
              <a href="#main" className="label-mono group inline-flex h-11 items-center gap-1.5 text-tertiary transition-colors duration-200 hover:text-foreground">
                Back to top
                <ArrowUp aria-hidden className="size-3.5 transition-transform duration-300 ease-[var(--tl-ease-enter)] group-hover:-translate-y-0.5" strokeWidth={2} />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Bottom-aligned and cropped a little by the edge, like a title card. */}
        <motion.div className="relative -mb-[1vw] px-2" style={reduced ? { letterSpacing: "-0.06em" } : { y, opacity, letterSpacing: tracking }}>
          <Wordmark />
        </motion.div>
      </div>
    </footer>
  );
}
