"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AuroraText } from "@registry/textlab/aurora-text/aurora-text";
import { GooeyText } from "@registry/textlab/gooey-text/gooey-text";
import { JellyText } from "@registry/textlab/jelly-text/jelly-text";
import { MarkerHighlight } from "@registry/textlab/marker-highlight/marker-highlight";
import { RollingNumber } from "@registry/textlab/rolling-number/rolling-number";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { Typewriter } from "@registry/textlab/typewriter/typewriter";
import { VariableProximity } from "@registry/textlab/variable-proximity/variable-proximity";
import { Reveal } from "./reveal";

function LiveCount() {
  const [value, setValue] = useState(48213);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => v + 7 + Math.ceil(Math.random() * 61)), 2400);
    return () => clearInterval(id);
  }, []);
  return <RollingNumber value={value} className="font-display tabular-nums" />;
}

type Card = { name: string; href: string; caption: string; node: ReactNode; span?: string; size?: string };

const cards: Card[] = [
  {
    name: "Gooey text",
    href: "/components/gooey-text",
    caption: "Words melt into each other like liquid.",
    node: <GooeyText words={["Melt", "Merge", "Morph", "Flow"]} className="font-display" />,
    span: "lg:col-span-2",
    size: "text-6xl sm:text-8xl",
  },
  { name: "Rolling number", href: "/components/rolling-number", caption: "Each digit rolls to its new value.", node: <LiveCount />, size: "text-5xl sm:text-6xl" },
  { name: "Scramble text", href: "/components/scramble-text", caption: "Letters decode into place on view.", node: <ScrambleText text="Access granted" className="font-display" />, size: "text-3xl sm:text-4xl xl:text-5xl" },
  {
    name: "Variable proximity",
    href: "/components/variable-proximity",
    caption: "Weight swells under your pointer.",
    node: <VariableProximity text="Move closer" />,
    span: "lg:col-span-2",
    size: "text-5xl sm:text-7xl",
  },
  {
    name: "Marker highlight",
    href: "/components/marker-highlight",
    caption: "A highlighter swipes behind the words.",
    node: (
      <span className="font-display">
        Say it <MarkerHighlight>once</MarkerHighlight>
      </span>
    ),
    size: "text-4xl sm:text-5xl",
  },
  { name: "Aurora text", href: "/components/aurora-text", caption: "Northern lights drift inside the letters.", node: <AuroraText text="After dark" className="font-display" />, size: "text-5xl sm:text-6xl" },
  {
    name: "Typewriter",
    href: "/components/typewriter",
    caption: "Types, pauses and deletes like a person.",
    node: <Typewriter words={["Ship it today", "Write it once", "Make it move"]} className="font-display" />,
    size: "text-4xl sm:text-5xl",
  },
  { name: "Jelly text", href: "/components/jelly-text", caption: "Letters wobble when you poke them.", node: <JellyText text="Poke me" className="font-display" />, size: "text-5xl sm:text-6xl" },
];

/** Live tiles of the library. Nothing here is a recording: hover, poke and wait to see each one run. */
export function Bento() {
  return (
    <MotionConfig reducedMotion="never">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        {cards.map((card, i) => (
          <Reveal as="li" key={card.name} delay={(i % 3) * 0.08} className={card.span}>
            <div className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-2xl bg-surface p-6 ring-1 ring-border transition-[box-shadow] duration-300 hover:ring-foreground/20">
              <div className={`relative z-10 flex flex-1 items-center justify-center py-8 text-center leading-none tracking-tight ${card.size ?? ""}`}>{card.node}</div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold">
                    {/* The card is the link target; the effect sits above the overlay so it can still be poked and hovered. */}
                    <Link href={card.href} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent">
                      {card.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-secondary">{card.caption}</p>
                </div>
                <ArrowUpRight aria-hidden className="size-5 shrink-0 text-tertiary transition-[transform,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" strokeWidth={1.75} />
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </MotionConfig>
  );
}
