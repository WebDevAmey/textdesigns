"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { RotateCcw } from "lucide-react";
import { BlurReveal } from "@registry/textlab/blur-reveal/blur-reveal";
import { GooeyText } from "@registry/textlab/gooey-text/gooey-text";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { VariableProximity } from "@registry/textlab/variable-proximity/variable-proximity";
import { ease } from "@registry/textlab/lib/motion-tokens";

type Scene = { name: string; href: string; render: (run: number) => ReactNode };

const display = "font-display font-semibold leading-[0.9] tracking-[-0.05em] text-[clamp(3rem,9vw,9rem)]";

const scenes: Scene[] = [
  { name: "Blur reveal", href: "/components/blur-reveal", render: (run) => <BlurReveal key={run} as="p" text="Words arrive in focus." trigger="mount" className={display} /> },
  { name: "Scramble text", href: "/components/scramble-text", render: (run) => <ScrambleText key={run} as="p" text="Access granted." trigger="mount" duration={1.2} className={display} /> },
  {
    name: "Variable proximity",
    href: "/components/variable-proximity",
    render: (run) => <VariableProximity key={run} as="p" text="Bring the cursor closer." font="var(--font-bricolage)" from={300} to={800} radius={4} className={`${display} font-normal`} />,
  },
  { name: "Gooey text", href: "/components/gooey-text", render: (run) => <GooeyText key={run} as="p" words={["Melt.", "Merge.", "Morph.", "Flow."]} interval={1.4} className={display} /> },
];

function Caption({ index, scene, onReplay }: { index: number; scene: Scene; onReplay: () => void }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <Link href={scene.href} className="label-mono group text-tertiary transition-colors duration-200 hover:text-foreground">
        Fig. {index + 1} <span className="ml-2 text-foreground">{scene.name}</span>
      </Link>
      <button
        type="button"
        onClick={onReplay}
        className="label-mono inline-flex h-11 items-center gap-2 text-tertiary transition-colors duration-200 hover:text-foreground"
      >
        <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
        Replay
      </button>
    </div>
  );
}

/** Desktop: one sticky viewport, scroll picks the scene, each scene runs its effect once as it arrives. */
function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const [runs, setRuns] = useState([0, 0, 0, 0]);
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(scenes.length - 1, Math.floor(p * scenes.length))));
  const replay = (i: number) => setRuns((r) => r.map((v, j) => (j === i ? v + 1 : v)));
  const scene = scenes[active];

  return (
    <div ref={ref} className="relative h-[400vh]">
      <div className="sticky top-[var(--header-h)] flex h-[calc(100svh-var(--header-h))] flex-col px-6 pb-8 pt-10 sm:px-10">
        {/* Progress rule: a hairline with four ticks that fills as the stage scrolls. */}
        <div aria-hidden className="absolute bottom-24 left-6 top-24 w-px bg-[var(--hairline)] sm:left-10">
          <motion.div className="w-px bg-accent" style={{ height: fill }} />
          {scenes.map((s, i) => (
            <span key={s.name} className={`absolute -left-[3px] size-[7px] rounded-full transition-colors duration-300 ${i <= active ? "bg-accent" : "bg-[var(--tl-surface-2)]"}`} style={{ top: `${(i / (scenes.length - 1)) * 100}%` }} />
          ))}
        </div>
        <div className="relative flex flex-1 items-center pl-10 sm:pl-16">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active}
              className="w-full max-w-6xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.3, ease: [...ease.exit] } }}
              transition={{ duration: 0.3, ease: [...ease.enter] }}
            >
              {scene.render(runs[active])}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pl-10 sm:pl-16">
          <Caption index={active} scene={scene} onReplay={() => replay(active)} />
        </div>
      </div>
    </div>
  );
}

/** Mobile and reduced motion: the same four scenes, stacked, no pinning. */
function Stacked() {
  const [runs, setRuns] = useState([0, 0, 0, 0]);
  return (
    <ol>
      {scenes.map((scene, i) => (
        <li key={scene.name} className="flex min-h-[70svh] flex-col justify-between border-t border-[var(--hairline)] px-6 py-10">
          <div className="flex flex-1 items-center">{scene.render(runs[i])}</div>
          <Caption index={i} scene={scene} onReplay={() => setRuns((r) => r.map((v, j) => (j === i ? v + 1 : v)))} />
        </li>
      ))}
    </ol>
  );
}

export function Stage({ total }: { total: number }) {
  return (
    <section aria-label="Live effects" className="relative bg-background">
      <MotionConfig reducedMotion="user">
        <div className="hidden md:block motion-reduce:hidden">
          <Pinned />
        </div>
        <div className="md:hidden motion-reduce:block">
          <Stacked />
        </div>
      </MotionConfig>
      <div className="mx-auto max-w-[1400px] px-6 pb-8 sm:px-10">
        <Link href="/components" className="label-mono inline-flex h-11 items-center text-foreground underline decoration-[var(--hairline)] underline-offset-[6px] transition-colors duration-200 hover:decoration-current">
          See all {total} effects
        </Link>
      </div>
    </section>
  );
}
