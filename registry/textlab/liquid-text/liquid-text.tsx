"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { useFrame } from "../lib/use-frame";
import { usePointerVars } from "../lib/use-pointer-vars";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";

export type LiquidTextVariant = "ripple" | "wave" | "still";

export interface LiquidTextProps {
  text: string;
  /** ripple stirs the letters under the pointer, wave keeps a slow current running, still is calm until touched. */
  variant?: LiquidTextVariant;
  /** Displacement strength in px at full stir. */
  strength?: number;
  /** Radius of the stirred area, in em. */
  radius?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Ripples run through the letters under the cursor. A displaced copy of the text is revealed only
 * around the pointer, so the rest of the word stays crisp and readable.
 */
export function LiquidText({ text, variant = "ripple", strength = 14, radius = 1.6, as: Tag = "span", reducedMotion = "user", className, style }: LiquidTextProps) {
  const id = useSvgId("tl-liquid");
  const root = useRef<HTMLElement | null>(null);
  const turbulence = useRef<SVGFETurbulenceElement | null>(null);
  const displace = useRef<SVGFEDisplacementMapElement | null>(null);
  const reduced = useReduced(reducedMotion);
  usePointerVars(root, { enabled: !reduced, rate: 10, rest: null });

  useFrame(
    (time) => {
      const t = turbulence.current;
      const d = displace.current;
      const node = root.current;
      if (!t || !d || !node) return;
      const inside = Number(node.style.getPropertyValue("--tl-in") || 0);
      const ambient = variant === "wave" ? 0.45 : variant === "ripple" ? 0.12 : 0;
      const amount = Math.max(ambient, inside);
      t.setAttribute("baseFrequency", `${0.012 + Math.sin(time * 0.6) * 0.004} ${0.05 + Math.cos(time * 0.8) * 0.012}`);
      d.setAttribute("scale", (amount * strength).toFixed(2));
    },
    { ref: root, enabled: !reduced },
  );

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  // The stirred copy shows inside the circle and the crisp copy outside it, cross-faded at the edge.
  const at = `circle ${radius}em at var(--tl-x, -100px) var(--tl-y, -100px)`;
  const inner = variant === "wave" ? "none" : `radial-gradient(${at}, #000 25%, transparent 100%)`;
  const outer = variant === "wave" ? "none" : `radial-gradient(${at}, transparent 25%, #000 100%)`;

  return (
    <Tag ref={root} className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={id} x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap ref={displace} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ visibility: variant === "wave" ? "hidden" : undefined, WebkitMaskImage: outer, maskImage: outer }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, filter: `url(#${id})`, WebkitMaskImage: inner, maskImage: inner }}>
        {text}
      </span>
    </Tag>
  );
}

export default LiquidText;
