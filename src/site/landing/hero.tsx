"use client";

import Link from "next/link";
import { SplitText } from "@registry/textlab/split-text/split-text";
import { ease } from "@registry/textlab/lib/motion-tokens";
import { CopyButton } from "../copy-button";
import { DeferredCloud } from "./deferred-cloud";
import { PreviewWindow } from "./preview-window";
import { Rise } from "./reveal";

/** Cloud sky from Aceternity's cloud shader, centered copy, and a live preview window as the product shot. */
export function Hero({ install, total }: { install: string; total: number }) {
  return (
    <section aria-labelledby="hero-title" className="relative min-h-[50rem] w-full overflow-hidden">
      <DeferredCloud />

      {/* A soft blue text shadow keeps white copy readable when a cloud drifts behind it. */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 text-center [text-shadow:0_1px_14px_rgba(24,72,128,0.55)] md:pt-24">
        <Rise>
          <Link
            href="/docs/changelog"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 py-1 pl-1 pr-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-sky-700">New</span>
            Eleven effects, rebuilt and smoother
          </Link>
        </Rise>
        <h1 id="hero-title" className="mt-6 font-display text-5xl font-semibold tracking-[-0.045em] text-white drop-shadow-md md:text-7xl lg:text-8xl">
          {/* Blur only, never opacity 0, so the headline paints at once and stays the LCP element. */}
          <SplitText as="span" trigger="mount" variant="words" stagger={0.06} duration={0.9} ease={[...ease.emphasized]} from={{ filter: "blur(12px)", y: "0.08em" }} text="Type that moves." />
        </h1>
        <Rise delay={0.3}>
          <p className="mt-6 max-w-2xl text-base text-white/90 drop-shadow-sm md:text-lg">
            {total} text effects for React. Install one with a single command and the source lands in your repo, ready to change.
          </p>
        </Rise>
        <Rise delay={0.4} className="mt-8 flex w-full flex-col items-center gap-3 [text-shadow:none] sm:w-auto sm:flex-row">
          <Link href="/components" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-sky-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90">
            Browse effects
          </Link>
          <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-white/40 bg-white/10 py-1 pl-5 pr-1 text-sm font-semibold text-white backdrop-blur-sm">
            <code className="no-scrollbar min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-normal">{install}</code>
            <CopyButton value={install} label="Copy install command" className="shrink-0 rounded-full text-white hover:bg-white/20 hover:text-white" />
          </span>
        </Rise>
        <Rise delay={0.45}>
          <p className="mt-4 text-xs text-white/80">Free and MIT licensed &middot; No runtime package</p>
        </Rise>
      </div>

      <Rise delay={0.55} y={24} blur={6} className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-10 md:mt-16 md:px-8">
        <PreviewWindow />
      </Rise>
    </section>
  );
}
