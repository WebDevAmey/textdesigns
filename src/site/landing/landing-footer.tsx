"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AuroraText } from "@registry/textlab/aurora-text/aurora-text";
import { ShimmerText } from "@registry/textlab/shimmer-text/shimmer-text";
import { Typewriter } from "@registry/textlab/typewriter/typewriter";
import { WaveText } from "@registry/textlab/wave-text/wave-text";
import { WordRotator } from "@registry/textlab/word-rotator/word-rotator";
import { GradientText } from "@registry/textlab/gradient-text/gradient-text";
import { site } from "../config";
import { DeferredCloud } from "./deferred-cloud";
import { Reveal } from "./reveal";
import { ThemeSwitch } from "./theme-switch";

/** A small window with traffic lights and a file name, holding one live effect. */
function Window({ file, children, className = "" }: { file: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white/90 text-black shadow-[0_10px_30px_-12px_rgba(20,60,110,0.45)] ring-1 ring-black/5 backdrop-blur ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-black/45">{file}</span>
      </div>
      <div className="flex min-h-28 items-center justify-center px-4 py-6 font-display text-3xl font-semibold tracking-[-0.03em]">{children}</div>
    </div>
  );
}

const linksA = [
  { href: "/components", label: "Components" },
  { href: "/docs/introduction", label: "Docs" },
  { href: "/guides", label: "Guides" },
  { href: "/docs/changelog", label: "Updates" },
  { href: "/docs/faq", label: "FAQ" },
  { href: "/roadmap", label: "Roadmap" },
];
const linksB = [
  { href: "/docs/ai", label: "AI and MCP" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: site.github, label: "GitHub" },
];

/** The wordmark, sized to span the footer column exactly. */
function Wordmark() {
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    const p = probe.current;
    if (!el || !p) return;
    const fit = () => setSize((el.clientWidth / p.getBoundingClientRect().width) * 100);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} aria-hidden className="relative -mb-[0.2em] overflow-hidden">
      <span ref={probe} className="invisible absolute whitespace-nowrap font-display text-[100px] font-semibold tracking-[-0.06em]">
        textlab
      </span>
      <p className="whitespace-nowrap font-display font-semibold leading-[0.8] tracking-[-0.06em] text-white" style={{ fontSize: size ? `${size}px` : "18vw" }}>
        textlab
      </p>
    </div>
  );
}

/**
 * Closing call to action on a cloud sky with a few live effects floating in windows, then a dark
 * footer: brand and theme on the left, two link columns, the legal line, and the wordmark.
 */
export function LandingFooter({ total, star }: { total: number; star: ReactNode }) {
  return (
    <>
      <div className="relative z-10 overflow-hidden rounded-b-[40px] bg-background">
        <section aria-labelledby="cta-title" className="relative overflow-hidden">
          <DeferredCloud />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-8 md:pb-28">
            <div aria-hidden className="pointer-events-none grid grid-cols-2 gap-3 [mask-image:linear-gradient(to_bottom,#000_40%,transparent_95%)] md:grid-cols-3">
              <Window file="shimmer.tsx" className="md:translate-y-6">
                <ShimmerText text="Loading…" />
              </Window>
              <Window file="aurora.tsx">
                <AuroraText text="After dark" />
              </Window>
              <Window file="typewriter.tsx" className="hidden md:block md:translate-y-10">
                <Typewriter words={["Write it once", "Ship it today"]} />
              </Window>
              <Window file="wave.tsx" className="md:-translate-y-2">
                <WaveText text="Make waves" amplitude={0.15} />
              </Window>
              <Window file="gradient.tsx" className="md:translate-y-4">
                <GradientText text="Spectrum" />
              </Window>
              <Window file="rotator.tsx" className="hidden md:block">
                <span>
                  For <WordRotator words={["teams", "agents", "you"]} />
                </span>
              </Window>
            </div>
            <Reveal className="relative mt-10 flex flex-col items-center text-center [text-shadow:0_1px_14px_rgba(24,72,128,0.5)]">
              <h2 id="cta-title" className="font-display text-5xl font-semibold tracking-[-0.045em] text-white md:text-7xl">
                Start typing.
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/90">{total} effects, free and MIT licensed. Install your first one in a minute.</p>
              <div className="mt-8 flex flex-col items-center gap-3 [text-shadow:none] sm:flex-row">
                <Link href="/components" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-sky-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90">
                  Browse effects
                </Link>
                {star}
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <footer className="-mt-10 bg-black pt-10 text-white">
        <div className="mx-auto max-w-[1056px] px-6 pt-16">
          <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <p className="font-display text-2xl font-semibold tracking-[-0.04em]">textlab</p>
              <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">Text effects for React and Next.js, installed as source with the shadcn CLI and readable by your AI tools.</p>
              <p className="mt-4 text-sm text-white/70">
                Built by{" "}
                <a href={site.github} className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
                  WebDevAmey
                </a>
              </p>
              <div className="mt-6">
                <ThemeSwitch />
              </div>
            </div>
            {[linksA, linksB].map((links, i) => (
              <ul key={i} className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-white/85 transition hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className="mt-16 grid gap-4 border-b border-white/15 pb-6 text-sm text-white/70 md:grid-cols-[1.6fr_1fr_1fr]">
            <p>©{new Date().getFullYear()} Textlab. MIT licensed.</p>
            <a href="https://opensource.org/license/mit" className="transition hover:text-white">
              License
            </a>
            <a href="#main" className="transition hover:text-white">
              Back to top
            </a>
          </div>
          <div className="pt-14">
            <Wordmark />
          </div>
        </div>
      </footer>
    </>
  );
}
