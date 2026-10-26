"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { EmberText } from "@registry/textlab/ember-text/ember-text";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { SplitText } from "@registry/textlab/split-text/split-text";
import { WaveText } from "@registry/textlab/wave-text/wave-text";
import { ease } from "@registry/textlab/lib/motion-tokens";
import { useReduced } from "@registry/textlab/lib/use-reduced";
import { CopyButton } from "../copy-button";
import { AsciiField } from "./ascii-field";
import { Grain } from "./grain";

const STEPS = ["scramble", "wave", "ember"] as const;
const CYCLES = 2;

/**
 * "moves." demonstrates the library: after the headline lands it runs scramble, wave and ember for
 * about three seconds each, twice, then rests on the plain word.
 */
function MovingWord() {
  const reduced = useReduced();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (reduced) return;
    const total = STEPS.length * CYCLES;
    if (step >= total) return;
    const id = setTimeout(() => setStep((s) => s + 1), step < 0 ? 1200 : 3000);
    return () => clearTimeout(id);
  }, [step, reduced]);

  const active = step >= 0 && step < STEPS.length * CYCLES ? STEPS[step % STEPS.length] : null;
  const word = "moves.";
  if (active === "scramble") return <ScrambleText key={step} text={word} trigger="mount" duration={0.9} />;
  if (active === "wave") return <WaveText key={step} text={word} amplitude={0.12} />;
  if (active === "ember") return <EmberText key={step} text={word} trigger="mount" duration={1.4} />;
  return <span>{word}</span>;
}

export function Hero({ install, stack }: { install: string; stack: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // As the next section slides over, the headline settles back instead of scrolling away.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="sticky top-0 isolate h-[calc(100svh-var(--header-h))] motion-reduce:static min-h-[560px] overflow-hidden">
      <AsciiField
        chars=" .:-=+*#%@"
        still="/landing/ascii-still.webp"
        parallax={5}
        className="inset-y-0 right-0 w-full md:w-[72%]"
        mask="radial-gradient(ellipse 75% 70% at 72% 42%, #000 20%, transparent 72%)"
      />
      <Grain />
      <motion.div style={reduced ? undefined : { scale, opacity, transformOrigin: "0% 100%" }} className="relative mx-auto flex h-full max-w-[1400px] flex-col px-6 sm:px-10">
        <Link href="/docs/changelog" className="label-mono mt-6 inline-flex w-max items-center gap-3 text-tertiary transition-colors duration-200 hover:text-foreground">
          <span className="text-accent">New</span>
          Eleven effects, rebuilt and smoother
        </Link>

        <div className="mt-auto pb-10 sm:pb-14">
          <h1 id="hero-title" className="font-display text-[clamp(3.5rem,11vw,11rem)] font-semibold leading-[0.86] tracking-[-0.055em]">
            {/* Words sharpen from a blur without starting invisible, so the headline is the LCP at first paint. */}
            <SplitText as="span" trigger="mount" variant="words" stagger={0.04} duration={0.8} ease={[...ease.emphasized]} from={{ filter: "blur(12px)", y: "0.1em" }} text="Type that" className="block" />
            <span className="block text-accent">
              <MovingWord />
            </span>
          </h1>

          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end [&>*]:min-w-0">
            <p className="max-w-md text-lg text-secondary lg:col-span-4">70 text effects for React. One command each. The source lands in your repo.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-8 lg:justify-end">
              <Link
                href="/components"
                className="inline-flex h-12 items-center justify-center rounded-[2px] bg-accent px-6 text-base font-semibold text-accent-foreground transition-transform duration-200 ease-[var(--tl-ease-enter)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
              >
                Browse effects
              </Link>
              <div className="inline-flex h-12 min-w-0 items-center gap-2 rounded-full pl-5 pr-2 ring-1 ring-[var(--hairline)] backdrop-blur-sm">
                <code className="no-scrollbar min-w-0 overflow-x-auto whitespace-nowrap font-mono text-sm text-secondary">{install}</code>
                <CopyButton value={install} label="Copy install command" className="shrink-0 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <p className="label-mono border-t border-[var(--hairline)] py-4 text-tertiary">{stack.join(" · ")}</p>
      </motion.div>
    </section>
  );
}
