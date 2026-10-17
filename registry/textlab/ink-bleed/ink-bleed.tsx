"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { animate } from "motion/react";
import { srOnly } from "../lib/a11y";
import { useHydrated } from "../lib/use-hydrated";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type InkBleedVariant = "ink" | "watercolor" | "stamp";

export interface InkBleedProps {
  text: string;
  /** ink soaks in with rough edges, watercolor blooms softly, stamp presses down with a grainy edge. */
  variant?: InkBleedVariant;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  duration?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/**
 * Text soaks in like ink on paper. A blur collapses through an alpha threshold, so the letters grow
 * outward from their cores with fibrous edges, then the edges settle sharp.
 */
export function InkBleed({ text, variant = "ink", as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration = 1.8, reducedMotion = "user", className, style, onComplete }: InkBleedProps) {
  const id = useSvgId("tl-ink");
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const hydrated = useHydrated();
  const blur = useRef<SVGFEGaussianBlurElement | null>(null);
  const disp = useRef<SVGFEDisplacementMapElement | null>(null);
  const matrix = useRef<SVGFEColorMatrixElement | null>(null);
  const layer = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const apply = (p: number) => {
      // p runs 0 (dry paper) to 1 (fully inked).
      const spread = (1 - p) * (variant === "watercolor" ? 14 : 9);
      blur.current?.setAttribute("stdDeviation", spread.toFixed(2));
      disp.current?.setAttribute("scale", ((1 - p) * (variant === "stamp" ? 18 : 10) + (variant === "stamp" ? 3 : 1.2)).toFixed(2));
      const gain = variant === "watercolor" ? 3 + p * 4 : 8 + p * 14;
      const cut = variant === "watercolor" ? 1 - p * 0.4 : 5.5 - p * 1.5 + (1 - p) * 3;
      matrix.current?.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${gain.toFixed(2)} -${cut.toFixed(2)}`);
      if (layer.current) layer.current.style.opacity = String(Math.min(1, p * 3));
    };
    if (!on) {
      apply(0);
      return;
    }
    const controls = animate(0, 1, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: apply, onComplete });
    return () => controls.stop();
    // onComplete is a callback; its identity should not restart the bleed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduced, variant, duration, delay]);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      data-tl-motion={reducedMotion === "user" ? "user" : undefined}
      data-tl-pending={hydrated ? undefined : ""}
      {...bind}
    >
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={id} x="-20%" y="-40%" width="140%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency={variant === "stamp" ? "0.9" : "0.045"} numOctaves={variant === "stamp" ? 1 : 3} seed="7" result="paper" />
            <feGaussianBlur ref={blur} in="SourceGraphic" stdDeviation="0" result="soft" />
            <feDisplacementMap ref={disp} in="soft" in2="paper" scale="1.2" xChannelSelector="R" yChannelSelector="G" result="fibres" />
            <feColorMatrix ref={matrix} in="fibres" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -4" />
          </filter>
        </defs>
      </svg>
      <span style={srOnly}>{text}</span>
      <span ref={layer} data-tl-part="" aria-hidden="true" style={{ display: "inline-block", filter: `url(#${id})`, opacity: 0, padding: "0.15em 0.2em", margin: "-0.15em -0.2em" }}>
        {text}
      </span>
    </Tag>
  );
}

export default InkBleed;
