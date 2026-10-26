"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { BlurReveal } from "@registry/textlab/blur-reveal/blur-reveal";
import { GooeyText } from "@registry/textlab/gooey-text/gooey-text";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { WaveText } from "@registry/textlab/wave-text/wave-text";
import { useReduced } from "@registry/textlab/lib/use-reduced";
import { ease } from "@registry/textlab/lib/motion-tokens";

type Slide = { name: string; code: string; render: () => ReactNode };

const slides: Slide[] = [
  { name: "blur-reveal", code: '<BlurReveal text="Ship it today." />', render: () => <BlurReveal text="Ship it today." trigger="mount" /> },
  { name: "scramble-text", code: '<ScrambleText text="Access granted." />', render: () => <ScrambleText text="Access granted." trigger="mount" duration={1.1} /> },
  { name: "gooey-text", code: '<GooeyText words={["Melt", "Merge", "Flow"]} />', render: () => <GooeyText words={["Melt.", "Merge.", "Flow."]} interval={0.9} duration={0.9} /> },
  { name: "wave-text", code: '<WaveText text="Make it move." />', render: () => <WaveText text="Make it move." amplitude={0.14} /> },
];

/**
 * The hero's product shot: an editor window whose headline is a live Textlab effect. It changes
 * effect every few seconds, but only while the hero is on screen and motion is allowed.
 */
export function PreviewWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const reduced = useReduced();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible || reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3200);
    return () => clearInterval(id);
  }, [visible, reduced]);

  const slide = slides[index];
  return (
    <div ref={ref} className="rounded-2xl border border-white/30 bg-white/20 p-2 shadow-2xl backdrop-blur-md md:rounded-[2rem] md:p-3">
      <div className="overflow-hidden rounded-xl border border-black/5 bg-background shadow-lg md:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-[var(--hairline)] px-4 py-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[var(--tl-surface-2)]" />
            <span className="size-2.5 rounded-full bg-[var(--tl-surface-2)]" />
            <span className="size-2.5 rounded-full bg-[var(--tl-surface-2)]" />
          </span>
          <span className="label-mono text-tertiary">hero.tsx</span>
          <span className="ml-auto flex gap-1" aria-hidden>
            {slides.map((s, i) => (
              <span key={s.name} className={`h-1 w-5 rounded-full transition-colors duration-300 ${i === index ? "bg-accent" : "bg-[var(--tl-surface-2)]"}`} />
            ))}
          </span>
        </div>
        <div className="grid md:grid-cols-[1fr_auto]">
          <div className="flex min-h-[220px] items-center justify-center px-6 py-12 sm:min-h-[300px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={index}
                className="text-center font-display text-4xl font-semibold leading-none tracking-[-0.045em] [text-wrap:balance] sm:text-7xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.25, ease: [...ease.exit] as [number, number, number, number] } }}
              >
                {slide.render()}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="border-t border-[var(--hairline)] bg-[var(--tl-surface)] px-5 py-4 md:w-80 md:border-l md:border-t-0">
            <p className="label-mono text-tertiary">Component</p>
            <p className="mt-1 font-mono text-sm text-foreground">{slide.name}</p>
            <p className="label-mono mt-5 text-tertiary">Usage</p>
            <code className="mt-1 block break-words font-mono text-sm text-secondary">{slide.code}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
