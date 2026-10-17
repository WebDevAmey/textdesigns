"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { hashString, seeded } from "../lib/math";
import { graphemes } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type TypewriterVariant = "bar" | "block" | "underscore";

export interface TypewriterProps {
  /** Phrases to type in turn. One phrase types once and stays. */
  words: string[];
  /** Caret shape. */
  variant?: TypewriterVariant;
  /** Milliseconds per typed letter, before jitter. */
  typeSpeed?: number;
  /** Milliseconds per deleted letter. */
  deleteSpeed?: number;
  /** Milliseconds to hold a finished phrase before deleting. */
  pause?: number;
  /** Keep cycling through the phrases. */
  loop?: boolean;
  /** Natural rhythm: small, deterministic variations in key timing. */
  humanize?: boolean;
  /** Reserve the width of the longest phrase so nothing around it moves. */
  reserve?: boolean;
  /** What screen readers hear. Defaults to every phrase in order. */
  label?: string;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always" | "hover">;
  active?: boolean;
  delay?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

const CSS = `
@keyframes tl-caret-blink { 0%, 45% { opacity: 1; } 55%, 100% { opacity: 0; } }
.tl-caret { display: inline-block; vertical-align: baseline; background: currentColor; animation: tl-caret-blink 1.05s steps(1) infinite; }
.tl-caret[data-busy] { animation: none; opacity: 1; }
.tl-caret[data-variant="bar"] { width: 0.07em; height: 1em; margin-left: 0.04em; transform: translateY(0.12em); border-radius: 1px; }
.tl-caret[data-variant="block"] { width: 0.55em; height: 1.05em; margin-left: 0.04em; transform: translateY(0.16em); opacity: 0.85; }
.tl-caret[data-variant="underscore"] { width: 0.55em; height: 0.08em; margin-left: 0.04em; }
@media (prefers-reduced-motion: reduce) { .tl-caret { animation: none; } }
`;

/**
 * Types, deletes and retypes with a caret. The caret holds solid while keys are moving and only
 * blinks at rest, the way real cursors behave.
 */
export function Typewriter({
  words,
  variant = "bar",
  typeSpeed = 70,
  deleteSpeed = 38,
  pause = 1600,
  loop = true,
  humanize = true,
  reserve = false,
  label,
  as: Tag = "span",
  trigger = "inView",
  active,
  delay = 0,
  reducedMotion = "user",
  className,
  style,
  onComplete,
}: TypewriterProps) {
  const { ref, on } = useTrigger<HTMLElement>({ trigger, active, once: true });
  const reduced = useReduced(reducedMotion);
  const [state, setState] = useState({ word: 0, length: 0, deleting: false });
  const phrases = words.length ? words : [""];
  const current = graphemes(phrases[state.word % phrases.length]);

  useEffect(() => {
    if (!on || reduced) return;
    const { word, length, deleting } = state;
    const total = current.length;
    const last = word === phrases.length - 1;
    const rand = seeded(hashString(`${word}-${length}-${deleting}`));
    const jitter = humanize ? 0.6 + rand() * 0.9 : 1;

    let wait: number;
    let next = state;
    if (!deleting && length < total) {
      wait = (length === 0 && word === 0 ? delay * 1000 : 0) + typeSpeed * jitter + (current[length - 1] === " " ? typeSpeed * 0.8 : 0);
      next = { word, length: length + 1, deleting: false };
    } else if (!deleting) {
      if (last && !loop) {
        onComplete?.();
        return;
      }
      if (phrases.length === 1 && !loop) return;
      wait = pause;
      next = { word, length, deleting: true };
    } else if (length > 0) {
      wait = deleteSpeed * (humanize ? 0.8 + rand() * 0.4 : 1);
      next = { word, length: length - 1, deleting: true };
    } else {
      wait = typeSpeed * 4;
      next = { word: (word + 1) % phrases.length, length: 0, deleting: false };
    }
    const id = setTimeout(() => setState(next), wait);
    return () => clearTimeout(id);
    // onComplete is a callback; its identity should not restart typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduced, state, current.length, phrases.length, typeSpeed, deleteSpeed, pause, loop, humanize, delay]);

  const spoken = label ?? phrases.join(", ");
  const longest = phrases.reduce((a, b) => (graphemes(b).length > graphemes(a).length ? b : a), "");

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style}>
        <span style={srOnly}>{spoken}</span>
        <span aria-hidden="true">{phrases[phrases.length === 1 || !loop ? phrases.length - 1 : 0]}</span>
      </Tag>
    );
  }

  const typed = current.slice(0, state.length).join("");
  const busy = on && (state.deleting ? state.length > 0 : state.length < current.length && state.length > 0);

  return (
    <Tag ref={ref} className={className} style={{ display: "inline-grid", ...style }}>
      <style href="tl-typewriter" precedence="default">{CSS}</style>
      <span style={srOnly}>{spoken}</span>
      {reserve && (
        <span aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden", whiteSpace: "pre" }}>
          {longest}
          <span className="tl-caret" data-variant={variant} />
        </span>
      )}
      <span aria-hidden="true" style={{ gridArea: "1 / 1", whiteSpace: "pre" }}>
        {typed}
        <span className="tl-caret" data-variant={variant} data-busy={busy ? "" : undefined} />
      </span>
    </Tag>
  );
}

export default Typewriter;
