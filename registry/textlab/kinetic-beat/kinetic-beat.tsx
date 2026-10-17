"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "motion/react";
import { srOnly } from "../lib/a11y";
import { splitWords } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type KineticBeatVariant = "pop" | "slam" | "bounce";

export interface KineticBeatProps {
  /** Words to hit, one per beat. */
  text: string;
  /** pop scales up with a little overshoot, slam crashes down from large and blurred, bounce hops in. */
  variant?: KineticBeatVariant;
  /** Beats per minute. */
  bpm?: number;
  /** Start over after the last word. */
  loop?: boolean;
  /** Beats of silence at the end of each loop. */
  rest?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const MOVES: Record<KineticBeatVariant, { initial: TargetAndTransition; transition: Transition; exit: TargetAndTransition }> = {
  pop: { initial: { scale: 0.4, opacity: 0 }, transition: { type: "spring", visualDuration: 0.22, bounce: 0.3 }, exit: { scale: 1.15, opacity: 0, transition: { duration: 0.12 } } },
  // Slam is an impact: it accelerates into the landing on purpose, so it uses an ease-in curve.
  slam: { initial: { scale: 2.6, opacity: 0, filter: "blur(10px)" }, transition: { duration: 0.16, ease: [0.5, 0, 1, 0.5] }, exit: { opacity: 0, transition: { duration: 0.08 } } },
  bounce: { initial: { y: "-0.8em", opacity: 0 }, transition: { type: "spring", visualDuration: 0.28, bounce: 0.3 }, exit: { y: "0.4em", opacity: 0, transition: { duration: 0.12 } } },
};

/**
 * Words hit on a beat, one per count, like a lyric video. Timing comes from the tempo, so it can be
 * synced to music by setting the same BPM.
 */
export function KineticBeat({ text, variant = "pop", bpm = 120, loop = true, rest = 2, as: Tag = "div", reducedMotion = "user", className, style }: KineticBeatProps) {
  const { ref, on } = useTrigger<HTMLElement>({ trigger: "inView", once: false });
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text).map((w) => w.text);
  const [beat, setBeat] = useState(0);
  const cycle = words.length + rest;

  useEffect(() => {
    if (!on || reduced) return;
    const id = setInterval(() => setBeat((b) => (loop ? (b + 1) % cycle : Math.min(b + 1, words.length - 1))), 60000 / bpm);
    return () => clearInterval(id);
  }, [on, reduced, bpm, loop, cycle, words.length]);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const word = beat < words.length ? words[beat] : null;
  const move = MOVES[variant];
  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "grid", placeItems: "center", ...style }}>
      <span style={srOnly}>{text}</span>
      {/* The longest word reserves the stage so the layout never jumps between beats. */}
      <span aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden", whiteSpace: "nowrap" }}>
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout">
        {word && (
          <motion.span
            key={`${beat}-${word}`}
            aria-hidden="true"
            style={{ gridArea: "1 / 1", whiteSpace: "nowrap", display: "inline-block" }}
            initial={move.initial}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={move.exit}
            transition={move.transition}
          >
            {word}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  );
}

export default KineticBeat;
