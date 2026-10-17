"use client";

import { Fragment, useRef, type CSSProperties, type ElementType, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { SrText } from "../lib/a11y";
import { splitWords } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { groupByLine, useSplitLines } from "../lib/use-split-lines";

export type ScrollFillVariant = "word" | "char" | "line";

export interface ScrollFillProps {
  text: string;
  /** What lights up as one unit. */
  variant?: ScrollFillVariant;
  /** Opacity of text that has not been read yet. */
  dim?: number;
  /** Scrollable ancestor to track. Defaults to the window. */
  container?: RefObject<HTMLElement | null>;
  /** Where filling starts and ends, as motion scroll offsets. */
  offset?: [string, string];
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

function Unit({ progress, range, dim, children, block }: { progress: MotionValue<number>; range: [number, number]; dim: number; children: React.ReactNode; block?: boolean }) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return <motion.span style={{ opacity, display: block ? "block" : undefined }}>{children}</motion.span>;
}

/**
 * Words light up as you read down the page. Progress comes straight from scroll position, so it
 * follows the reader exactly, forwards and backwards.
 */
export function ScrollFill({ text, variant = "word", dim = 0.18, container, offset = ["start 0.85", "end 0.45"], as: Tag = "p", reducedMotion = "user", className, style }: ScrollFillProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  // The offset strings are motion's scroll offset syntax; the cast keeps the public prop simple.
  const { scrollYProgress } = useScroll({ target: ref, container, offset: offset as never });
  const words = splitWords(text);
  const lines = useSplitLines(ref, words.length, variant === "line" && !reduced);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const total = words.reduce((n, w) => n + w.chars.length, 0);
  let content: React.ReactNode;
  if (variant === "char") {
    content = words.map((word, w) => (
      <Fragment key={w}>
        <span style={{ whiteSpace: "nowrap" }}>
          {word.chars.map((char, c) => {
            const i = word.charOffset + c;
            return (
              <Unit key={c} progress={scrollYProgress} range={[i / total, (i + 1) / total]} dim={dim}>
                {char}
              </Unit>
            );
          })}
        </span>
        {w < words.length - 1 ? " " : null}
      </Fragment>
    ));
  } else if (variant === "line" && lines) {
    const groups = groupByLine(words, lines);
    content = groups.map((group, l) => (
      <Unit key={l} progress={scrollYProgress} range={[l / groups.length, (l + 1) / groups.length]} dim={dim} block>
        {group.map((word, w) => (
          <Fragment key={w}>
            <span data-tl-word="">{word.text}</span>
            {w < group.length - 1 ? " " : null}
          </Fragment>
        ))}
      </Unit>
    ));
  } else {
    content = words.map((word, w) => (
      <Fragment key={w}>
        <span data-tl-word="">
          <Unit progress={scrollYProgress} range={[w / words.length, (w + 1) / words.length]} dim={dim}>
            {word.text}
          </Unit>
        </span>
        {w < words.length - 1 ? " " : null}
      </Fragment>
    ));
  }

  return (
    <Tag ref={ref} className={className} style={style}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">{content}</span>
    </Tag>
  );
}

export default ScrollFill;
