"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { AuroraText } from "@registry/textlab/aurora-text/aurora-text";
import { CircleAnnotate } from "@registry/textlab/circle-annotate/circle-annotate";
import { GlitchText } from "@registry/textlab/glitch-text/glitch-text";
import { JellyText } from "@registry/textlab/jelly-text/jelly-text";
import { RollingNumber } from "@registry/textlab/rolling-number/rolling-number";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { Typewriter } from "@registry/textlab/typewriter/typewriter";
import { VariableProximity } from "@registry/textlab/variable-proximity/variable-proximity";
import { WordRotator } from "@registry/textlab/word-rotator/word-rotator";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

function LiveCount() {
  const [value, setValue] = useState(48213);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => v + 7 + Math.ceil(Math.random() * 61)), 2400);
    return () => clearInterval(id);
  }, []);
  return <RollingNumber value={value} className="tabular-nums" />;
}

type Card = { name: string; href: string; blurb: string; node: ReactNode };

const cards: Card[] = [
  { name: "Scramble text", href: "/components/scramble-text", blurb: "Letters decode into place.", node: <ScrambleText text="Access granted" /> },
  { name: "Rolling number", href: "/components/rolling-number", blurb: "Each digit rolls to its new value.", node: <LiveCount /> },
  { name: "Variable proximity", href: "/components/variable-proximity", blurb: "Weight swells under the pointer.", node: <VariableProximity text="Move closer" font="var(--font-bricolage)" from={300} to={800} /> },
  { name: "Word rotator", href: "/components/word-rotator", blurb: "One word in the sentence keeps changing.", node: <span>Built for <WordRotator words={["designers", "teams", "agents"]} /></span> },
  { name: "Aurora text", href: "/components/aurora-text", blurb: "Northern lights drift inside the letters.", node: <AuroraText text="After dark" /> },
  { name: "Circle annotate", href: "/components/circle-annotate", blurb: "A pen circles the word that matters.", node: <span>Read <CircleAnnotate>this</CircleAnnotate> first</span> },
  { name: "Typewriter", href: "/components/typewriter", blurb: "Types, pauses and deletes like a person.", node: <Typewriter words={["Write it once", "Ship it today"]} /> },
  { name: "Glitch text", href: "/components/glitch-text", blurb: "Short, hard bursts with long rests.", node: <GlitchText text="Signal lost" /> },
  { name: "Jelly text", href: "/components/jelly-text", blurb: "Letters wobble when you poke them.", node: <JellyText text="Poke me" /> },
];

/** Nine live effects, nothing recorded. Each card links to its docs page; the effect itself stays interactive. */
export function EffectsGrid({ total }: { total: number }) {
  return (
    <section aria-labelledby="effects-title" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <SectionHead
        id="effects-title"
        title={`${total} effects, every one live.`}
        body="Hover, poke or just watch. Each card is the real component running on this page."
        action={
          <Link href="/components" className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-[var(--hairline)] transition hover:bg-surface">
            Browse all {total}
          </Link>
        }
      />
      <MotionConfig reducedMotion="user">
        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          {cards.map((card, i) => (
            <Reveal as="li" key={card.name} delay={(i % 3) * 0.06}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-[var(--hairline)] transition-[box-shadow] duration-300 hover:ring-foreground/20">
                <div className="relative z-10 flex min-h-56 items-center justify-center px-6 py-10 text-center font-display text-4xl font-semibold leading-none tracking-[-0.04em]">{card.node}</div>
                <div className="flex items-end justify-between gap-4 border-t border-[var(--hairline)] px-5 py-4">
                  <div>
                    <h3 className="text-base font-semibold">
                      {/* The whole card is clickable; the effect area sits above the overlay so it stays interactive. */}
                      <Link href={card.href} className="after:absolute after:inset-0 after:rounded-2xl">
                        {card.name}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-sm text-secondary">{card.blurb}</p>
                  </div>
                  <ArrowUpRight aria-hidden className="size-4 shrink-0 text-tertiary transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" strokeWidth={1.75} />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </MotionConfig>
    </section>
  );
}
