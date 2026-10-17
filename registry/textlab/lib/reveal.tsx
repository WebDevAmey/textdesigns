"use client";

import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";
import { motion, type TargetAndTransition, type Transition } from "motion/react";
import { SrText, cx } from "./a11y";
import { duration as durations, resolveEase, stagger as staggers, type EaseInput } from "./motion-tokens";
import { splitWords, type SplitBy } from "./split";
import { useHydrated } from "./use-hydrated";
import { useReduced, type ReducedMotion } from "./use-reduced";
import { groupByLine, useSplitLines } from "./use-split-lines";
import { useTrigger, type Trigger } from "./use-trigger";

export type RevealOrder = "start" | "end" | "center" | "edges";

export interface RevealBaseProps {
  text: string;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  amount?: number;
  delay?: number;
  stagger?: number;
  duration?: number;
  ease?: EaseInput;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

export interface RevealTextProps extends RevealBaseProps {
  by: SplitBy;
  /** Where each part starts. */
  hidden: TargetAndTransition;
  /** Where each part lands. Defaults to the identity: visible, no transform, no blur. */
  shown?: TargetAndTransition;
  /** Wrap each part in an overflow clip so it rises out of nowhere. */
  clip?: boolean;
  /** Which part moves first. */
  order?: RevealOrder;
  /** Styles applied to every animated part. */
  partStyle?: CSSProperties | ((index: number, total: number) => CSSProperties);
  /** Extra per-part delay in seconds, added after the stagger. */
  partDelay?: (index: number, total: number) => number;
}

const SHOWN: TargetAndTransition = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: "blur(0px)", letterSpacing: "0em" };

/** Descenders and blur need room inside a clip; the negative margin keeps layout unchanged. */
const clipStyle: CSSProperties = { display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: "0.08em 0.12em 0.2em", margin: "-0.08em -0.12em -0.2em" };
const lineClipStyle: CSSProperties = { display: "block", overflow: "hidden", padding: "0.06em 0.12em 0.18em", margin: "-0.06em -0.12em -0.18em" };

function rank(index: number, total: number, order: RevealOrder) {
  if (order === "end") return total - 1 - index;
  const mid = (total - 1) / 2;
  if (order === "center") return Math.abs(index - mid);
  if (order === "edges") return mid - Math.abs(index - mid);
  return index;
}

/**
 * The engine behind every split reveal. Splits by chars, words or lines, keeps one copy of the
 * text for screen readers, and staggers parts from `hidden` to `shown`.
 * Opacity leads, blur clears next and the transform settles last, so the text is readable early.
 */
export function RevealText({
  text,
  as: Tag = "span",
  by,
  hidden,
  shown = SHOWN,
  clip = false,
  order = "start",
  trigger = "inView",
  active,
  once = true,
  amount,
  delay = 0,
  stagger,
  duration = durations.reveal,
  ease,
  reducedMotion = "user",
  className,
  style,
  partStyle,
  partDelay,
  onComplete,
}: RevealTextProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once, amount });
  const hydrated = useHydrated();
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text);
  const lines = useSplitLines(ref, words.length, by === "lines" && !reduced);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  const step = stagger ?? (by === "chars" ? staggers.char : by === "words" ? staggers.word : staggers.line);
  const curve = resolveEase(ease);
  const visible = on;

  const transitionFor = (i: number, total: number): Transition => {
    if (!visible) return { duration: durations.fast, ease: resolveEase("exit") };
    const d = delay + rank(i, total, order) * step + (partDelay?.(i, total) ?? 0);
    return {
      default: { duration, delay: d, ease: curve },
      opacity: { duration: duration * 0.56, delay: d, ease: curve },
      filter: { duration: duration * 0.78, delay: d, ease: curve },
    };
  };

  const styleFor = (i: number, total: number): CSSProperties => ({
    display: "inline-block",
    ...(typeof partStyle === "function" ? partStyle(i, total) : partStyle),
  });

  // A render function, not a component, so parts keep their identity across renders.
  const part = (key: number, i: number, total: number, children: ReactNode, block = false) => {
    const node = (
      <motion.span
        key={clip ? undefined : key}
        data-tl-part=""
        style={{ ...styleFor(i, total), ...(block ? { display: "block" } : null) }}
        initial={hidden}
        animate={visible ? shown : hidden}
        transition={transitionFor(i, total)}
        onAnimationComplete={i === total - 1 && visible ? onComplete : undefined}
      >
        {children}
      </motion.span>
    );
    if (!clip) return node;
    return (
      <span key={key} style={block ? lineClipStyle : clipStyle}>
        {node}
      </span>
    );
  };

  let content: ReactNode;
  if (by === "chars") {
    const total = words.reduce((n, w) => n + w.chars.length, 0);
    content = words.map((word, w) => (
      <Fragment key={w}>
        <span data-tl-word="" style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.chars.map((char, c) => part(c, word.charOffset + c, total, char))}
        </span>
        {w < words.length - 1 ? " " : null}
      </Fragment>
    ));
  } else if (by === "words" || !lines) {
    // Lines render as words until measured, so the server markup is already split and hidden.
    content = words.map((word, w) => (
      <Fragment key={w}>
        <span data-tl-word="" style={{ display: "inline-block" }}>
          {part(0, by === "lines" ? 0 : w, by === "lines" ? 1 : words.length, word.text)}
        </span>
        {w < words.length - 1 ? " " : null}
      </Fragment>
    ));
  } else {
    const groups = groupByLine(words, lines);
    content = groups.map((group, l) =>
      part(
        l,
        l,
        groups.length,
        group.map((word, w) => (
          <Fragment key={w}>
            <span data-tl-word="">{word.text}</span>
            {w < group.length - 1 ? " " : null}
          </Fragment>
        )),
        true,
      ),
    );
  }

  return (
    <Tag
      ref={ref}
      className={cx(className)}
      style={style}
      data-tl-motion={reducedMotion === "user" ? "user" : undefined}
      data-tl-pending={hydrated ? undefined : ""}
      {...bind}
    >
      <SrText>{text}</SrText>
      <span aria-hidden="true">{content}</span>
    </Tag>
  );
}
