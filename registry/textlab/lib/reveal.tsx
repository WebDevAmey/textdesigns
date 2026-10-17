"use client";

import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";
import { motion, type MotionStyle, type TargetAndTransition, type Transition } from "motion/react";
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
  /** Forwarded to the root element. */
  id?: string;
  onComplete?: () => void;
}

export interface RevealTextProps extends RevealBaseProps {
  by: SplitBy;
  /** Where each part starts. A function gets the part index and count, for per-part offsets. */
  hidden: TargetAndTransition | ((index: number, total: number) => TargetAndTransition);
  /** Where each part lands. Transform shorthands here are ignored: parts always settle at rest. */
  shown?: TargetAndTransition;
  /** Wrap each part in an overflow clip so it rises out of nowhere. */
  clip?: boolean;
  /** Which part moves first. */
  order?: RevealOrder;
  /** Styles applied to every animated part. */
  partStyle?: MotionStyle | ((index: number, total: number) => MotionStyle);
  /** Extra per-part delay in seconds, added after the stagger. */
  partDelay?: (index: number, total: number) => number;
}

type Pose = TargetAndTransition & Record<string, unknown>;

const unit = (v: unknown, fallback: string) => (typeof v === "string" ? v.replace(/^[-\d.]+/, "") || fallback : fallback);
const len = (v: unknown, fallback = "px") => (typeof v === "number" ? `${v}${fallback}` : String(v));

/**
 * Turn motion's x / y / scale / rotate shorthands into one transform string, plus the matching
 * resting string with the same functions and units. Full transform strings can be handed to the
 * compositor; the shorthands are composed on the main thread and drop frames while the page loads.
 */
function poses(hidden: Pose, shown?: Pose): { from: Pose; to: Pose } {
  const { x, y, scale, rotate, rotateX, transformPerspective, ...restFrom } = hidden;
  const restTo: Pose = { ...shown };
  for (const key of ["x", "y", "scale", "rotate", "rotateX", "transformPerspective"]) delete restTo[key];
  const fns: [string, string][] = [];
  if (transformPerspective !== undefined) fns.push([`perspective(${len(transformPerspective)})`, `perspective(${len(transformPerspective)})`]);
  if (x !== undefined) fns.push([`translateX(${len(x)})`, `translateX(0${unit(x, "px")})`]);
  if (y !== undefined) fns.push([`translateY(${len(y)})`, `translateY(0${unit(y, "px")})`]);
  if (scale !== undefined) fns.push([`scale(${scale})`, "scale(1)"]);
  if (rotate !== undefined) fns.push([`rotate(${len(rotate, "deg")})`, "rotate(0deg)"]);
  if (rotateX !== undefined) fns.push([`rotateX(${len(rotateX, "deg")})`, "rotateX(0deg)"]);
  const from: Pose = { ...restFrom };
  const to: Pose = restTo;
  if (fns.length) {
    from.transform = fns.map((f) => f[0]).join(" ");
    to.transform = fns.map((f) => f[1]).join(" ");
  }
  if (from.opacity !== undefined && to.opacity === undefined) to.opacity = 1;
  if (from.filter !== undefined && to.filter === undefined) to.filter = "blur(0px)";
  return { from, to };
}

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
  shown,
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
  id,
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
      <Tag ref={ref} id={id} className={className} style={style} {...bind}>
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

  const styleFor = (i: number, total: number): MotionStyle => ({
    display: "inline-block",
    ...(typeof partStyle === "function" ? partStyle(i, total) : partStyle),
  });

  // A render function, not a component, so parts keep their identity across renders.
  const part = (key: number, i: number, total: number, children: ReactNode, block = false) => {
    const { from: start, to: end } = poses((typeof hidden === "function" ? hidden(i, total) : hidden) as Pose, shown as Pose | undefined);
    const node = (
      <motion.span
        key={clip ? undefined : key}
        data-tl-part=""
        style={{ ...styleFor(i, total), ...(block ? { display: "block" } : null) }}
        initial={start}
        animate={visible ? end : start}
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
      id={id}
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
