"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { HoloText } from "@registry/textlab/holo-text/holo-text";
import { LiquidText } from "@registry/textlab/liquid-text/liquid-text";
import { ParticleText } from "@registry/textlab/particle-text/particle-text";
import { PathText } from "@registry/textlab/path-text/path-text";
import { PixelSort } from "@registry/textlab/pixel-sort/pixel-sort";
import { PriceTicker } from "@registry/textlab/price-ticker/price-ticker";
import { ShaderRipple } from "@registry/textlab/shader-ripple/shader-ripple";
import { Signature } from "@registry/textlab/signature/signature";
import { SplitFlap } from "@registry/textlab/split-flap/split-flap";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const CITIES = ["LISBON", "KYOTO", "OAXACA", "TBILISI", "HOBART"];

/** Departure board: the city changes every few seconds and each flap turns over in sequence. */
function Departures() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % CITIES.length), 3200);
    return () => clearInterval(id);
  }, []);
  return <SplitFlap text={CITIES[i]} length={7} className="font-mono text-2xl font-medium sm:text-3xl" />;
}

/** A live price that drifts up and down, flashing the direction of each move. */
function Ticker() {
  const [value, setValue] = useState(184.32);
  useEffect(() => {
    const id = setInterval(() => setValue((x) => +(x * (1 + (Math.random() > 0.45 ? 1 : -1) * (0.002 + Math.random() * 0.008))).toFixed(2)), 1800);
    return () => clearInterval(id);
  }, []);
  return <PriceTicker value={value} variant="currency" className="font-display text-5xl font-semibold" />;
}

type Card = { name: string; href: string; blurb: string; tag: string; node: ReactNode };

const cards: Card[] = [
  { name: "Particle text", href: "/components/particle-text", tag: "Canvas", blurb: "Thousands of particles hold the word; your cursor scatters them.", node: <ParticleText text="Stardust" variant="stars" className="font-display text-6xl font-semibold leading-none tracking-[-0.03em]" /> },
  { name: "Split flap", href: "/components/split-flap", tag: "Typing", blurb: "A departure board, flap by flap.", node: <Departures /> },
  { name: "Shader ripple", href: "/components/shader-ripple", tag: "WebGL", blurb: "Type behind water. Move to make waves.", node: <ShaderRipple text="Surface" className="font-display text-6xl font-semibold leading-none tracking-[-0.03em]" /> },
  { name: "Signature", href: "/components/signature", tag: "Draw", blurb: "A name signed stroke by stroke.", node: <Signature text="Ada Lovelace" className="text-6xl" /> },
  { name: "Liquid text", href: "/components/liquid-text", tag: "Distort", blurb: "Letters bend like a reflection when the pointer passes.", node: <LiquidText text="Still water" className="font-display text-6xl font-semibold leading-none tracking-[-0.03em]" /> },
  { name: "Holo text", href: "/components/holo-text", tag: "Light", blurb: "A foil sheen that follows your tilt.", node: <HoloText text="Limited" variant="holo" className="font-display text-6xl font-semibold leading-none tracking-[-0.03em]" /> },
  { name: "Price ticker", href: "/components/price-ticker", tag: "Numbers", blurb: "Live values that roll and flash their direction.", node: <Ticker /> },
  { name: "Pixel sort", href: "/components/pixel-sort", tag: "Pixel", blurb: "Columns of pixels sort themselves into the word.", node: <PixelSort text="Corrupted" className="font-display text-5xl font-semibold leading-none tracking-[-0.03em]" /> },
  { name: "Path text", href: "/components/path-text", tag: "Path", blurb: "A sentence that rides a curve, endlessly.", node: <PathText text="Text that follows the line" variant="circle" className="w-[200px] font-sans text-sm font-medium uppercase" /> },
];

/** Nine of the richer effects, live. Each card links to its docs; the effect area stays interactive. */
export function EffectsGrid({ total }: { total: number }) {
  return (
    <section aria-labelledby="effects-title" className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
      <SectionHead
        id="effects-title"
        eyebrow="Components"
        title="Effects worth staring at."
        body={`Nine of the ${total}, running live. Hover, move and watch.`}
        action={
          <Link href="/components" className="inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition hover:-translate-y-0.5 active:translate-y-0">
            Browse all {total}
          </Link>
        }
      />
      <MotionConfig reducedMotion="user">
        <ul className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3 [&>*]:min-w-0">
          {cards.map((card, i) => (
            <Reveal as="li" key={card.name} delay={(i % 3) * 0.06}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-[var(--hairline)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-2 px-4 pt-4">
                  <span aria-hidden className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="label-mono ml-auto text-tertiary">{card.tag}</span>
                </div>
                <div className="relative z-10 flex min-h-60 flex-1 items-center justify-center overflow-hidden px-6 py-8 text-center">{card.node}</div>
                <div className="flex items-end justify-between gap-4 px-5 pb-5">
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
