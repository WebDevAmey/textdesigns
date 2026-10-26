"use client";

import { motion } from "motion/react";
import { RollingNumber } from "@registry/textlab/rolling-number/rolling-number";
import { useTrigger } from "@registry/textlab/lib/use-trigger";
import { ease } from "@registry/textlab/lib/motion-tokens";

type Curve = [number, number, number, number];
const emphasized = [...ease.emphasized] as Curve;

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "0px 0px -15% 0px" },
  transition: { pathLength: { duration: 0.9, delay, ease: emphasized }, opacity: { duration: 0.1, delay } },
});

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;

/** A folder outline, then a file sliding into it. */
function FolderMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
      <motion.path d="M8 22 V50 H56 V24 H30 L25 18 H8 Z" {...stroke} {...draw()} />
      <motion.g initial={{ y: -14, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.7, ease: [...ease.emphasized] }}>
        <path d="M24 30 H38 L42 34 V44 H24 Z" {...stroke} />
      </motion.g>
    </svg>
  );
}

/** A waveform that settles into one calm line: the sentence, heard once. */
function WaveMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
      <motion.path
        {...stroke}
        initial={{ d: "M6 32 L14 20 L22 44 L30 14 L38 50 L46 24 L52 38 L58 32", pathLength: 0 }}
        whileInView={{ d: "M6 32 L14 32 L22 32 L30 32 L38 32 L46 32 L52 32 L58 32", pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ pathLength: { duration: 0.6, ease: [...ease.enter] }, d: { duration: 0.9, delay: 0.6, ease: [...ease.standard] } }}
      />
    </svg>
  );
}

/** A spring curve that overshoots a little and settles. */
function SpringMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
      <path d="M8 52 H58" {...stroke} strokeOpacity={0.3} />
      <motion.path d="M8 52 C 18 52, 20 14, 30 14 C 38 14, 38 26, 44 24 C 50 22, 52 20, 58 20" {...stroke} {...draw()} />
    </svg>
  );
}

/** A prompt chevron and a caret that blinks after it is drawn. */
function CaretMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
      <motion.path d="M12 22 L24 32 L12 42" {...stroke} {...draw()} />
      <motion.path d="M30 44 H48" {...stroke} {...draw(0.4)} />
      <rect x="50" y="20" width="2" height="24" fill="currentColor" className="animate-[tl-caret_1.1s_steps(1)_infinite] motion-reduce:animate-none" />
    </svg>
  );
}

const rows = [
  { mark: <FolderMark />, title: "Source in your repo.", body: "No package to update." },
  { mark: <WaveMark />, title: "Accessible by default.", body: "Screen readers hear the sentence once. Reduced motion gets still text." },
  { mark: <SpringMark />, title: "Motion with intent.", body: "Shared easing tokens, hand-tuned durations." },
  { mark: <CaretMark />, title: "Ready for your agent.", body: "Markdown docs, llms.txt, MCP server." },
];

function Stat({ value, label }: { value: number; label: string }) {
  const { ref, on } = useTrigger<HTMLDivElement>({ trigger: "inView", once: true });
  return (
    <div ref={ref} className="border-t border-[var(--hairline)] pt-5">
      <RollingNumber value={on ? value : 0} className="font-display text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums" />
      <p className="label-mono mt-3 text-tertiary">{label}</p>
    </div>
  );
}

export function Details({ stats }: { stats: { value: number; label: string }[] }) {
  return (
    <section aria-labelledby="details-title" className="relative border-t border-[var(--hairline)] bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12 [&>*]:min-w-0">
          <h2 id="details-title" className="font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em] [text-wrap:balance] lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:col-span-5 lg:self-start">
            The details are already done.
          </h2>
          <ol className="lg:col-span-7">
            {rows.map((row, i) => (
              <li key={row.title} className="grid grid-cols-[3rem_1fr_auto] items-start gap-4 border-t border-[var(--hairline)] py-8 sm:gap-8">
                <span className="label-mono pt-1.5 text-tertiary">{String(i + 1).padStart(3, "0")}</span>
                <p className="text-xl leading-snug [text-wrap:pretty] sm:text-2xl">
                  <span className="font-semibold">{row.title}</span> <span className="text-secondary">{row.body}</span>
                </p>
                <span className="text-accent">{row.mark}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-24 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
        <p className="mt-10 text-lg text-secondary">Free and MIT licensed. No runtime package.</p>
      </div>
    </section>
  );
}
