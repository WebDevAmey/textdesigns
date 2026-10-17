"use client";

import { useRef, useState, type CSSProperties, type ElementType, type RefObject } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { srOnly } from "../lib/a11y";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useScrollVelocity } from "../lib/use-scroll-velocity";

export type VelocityMarqueeVariant = "single" | "double" | "outline";

export interface VelocityMarqueeProps {
  text: string;
  /** single is one row, double adds a second row running the other way, outline alternates solid and hollow copies. */
  variant?: VelocityMarqueeVariant;
  /** Resting speed in percent of one copy per second. */
  speed?: number;
  /** How much scroll speed boosts the marquee. */
  boost?: number;
  /** Separator between copies. */
  separator?: string;
  /** Pause while hovered or focused. Recommended so people can read it. */
  pauseOnHover?: boolean;
  container?: RefObject<HTMLElement | null>;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const COPIES = 4;
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ text, separator, outline, x }: { text: string; separator: string; outline: boolean; x: MotionValue<string> }) {
  return (
    <motion.div aria-hidden="true" style={{ display: "flex", whiteSpace: "nowrap", x, willChange: "transform" }}>
      {Array.from({ length: COPIES }, (_, i) => (
        <span
          key={i}
          style={{
            paddingRight: "0.4em",
            ...(outline && i % 2 === 1 ? { WebkitTextFillColor: "transparent", WebkitTextStroke: "0.025em currentColor" } : null),
          }}
        >
          {text}
          <span style={{ padding: "0 0 0 0.4em", opacity: 0.4 }}>{separator}</span>
        </span>
      ))}
    </motion.div>
  );
}

/**
 * A marquee that speeds up, slows down and reverses with your scroll. Scroll down and it races
 * forward; scroll up and it turns around; stop and it eases back to its resting pace.
 */
export function VelocityMarquee({
  text,
  variant = "single",
  speed = 6,
  boost = 4,
  separator = "✦",
  pauseOnHover = true,
  container,
  as: Tag = "div",
  reducedMotion = "user",
  className,
  style,
}: VelocityMarqueeProps) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const velocity = useScrollVelocity(container, { stiffness: 300, damping: 50 });
  const base = useMotionValue(0);
  const direction = useRef(1);
  const [paused, setPaused] = useState(false);
  // Each copy is 1/COPIES of the row; wrapping by one copy makes the loop seamless.
  const x = useTransform(base, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const xReverse = useTransform(base, (v) => `${wrap(-100 / COPIES, 0, -v - 100 / COPIES / 2)}%`);

  useFrame(
    (_, dt) => {
      const v = velocity.get();
      if (v < -5) direction.current = -1;
      else if (v > 5) direction.current = 1;
      const factor = 1 + Math.min(Math.abs(v) / 1000, 6) * boost;
      const step = (paused ? 0 : 1) * direction.current * (speed / COPIES) * factor * dt;
      base.set(base.get() - step);
    },
    { ref: root, enabled: !reduced },
  );

  const hover = pauseOnHover ? { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocus: () => setPaused(true), onBlur: () => setPaused(false) } : {};

  if (reduced) {
    return (
      <Tag className={className} style={{ overflow: "hidden", whiteSpace: "nowrap", ...style }}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={root} className={className} style={{ overflow: "hidden", ...style }} {...hover}>
      <span style={srOnly}>{text}</span>
      <Row text={text} separator={separator} outline={variant === "outline"} x={x} />
      {variant === "double" && <Row text={text} separator={separator} outline x={xReverse} />}
    </Tag>
  );
}

export default VelocityMarquee;
