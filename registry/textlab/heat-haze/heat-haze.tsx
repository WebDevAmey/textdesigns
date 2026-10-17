"use client";

import type { CSSProperties, ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";

export type HeatHazeVariant = "haze" | "boil";

export interface HeatHazeProps {
  text: string;
  /** haze shimmers gently, boil rises fast like air over hot asphalt. */
  variant?: HeatHazeVariant;
  /** Distortion strength in px. */
  strength?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * A mirage warps the type. Rising turbulence bends the letters most at the top and leaves the
 * baseline nearly still, the way heat shimmers above a road.
 */
export function HeatHaze({ text, variant = "haze", strength = 6, as: Tag = "span", reducedMotion = "user", className, style }: HeatHazeProps) {
  const id = useSvgId("tl-haze");
  const reduced = useReduced(reducedMotion);
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }
  const boil = variant === "boil";
  return (
    <Tag className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={id} x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency={boil ? "0.02 0.09" : "0.01 0.06"} numOctaves="2" seed="11" result="noise">
              <animate attributeName="seed" values="11;12;13;14;15;16;17;18" dur={boil ? "0.8s" : "2.4s"} repeatCount="indefinite" calcMode="discrete" />
            </feTurbulence>
            <feOffset in="noise" dy="0" result="rising">
              <animate attributeName="dy" from="40" to="-40" dur={boil ? "1.2s" : "4s"} repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="rising" scale={boil ? strength * 1.8 : strength} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ display: "inline-block", filter: `url(#${id})`, padding: "0.1em 0.1em", margin: "-0.1em -0.1em" }}>
        {text}
      </span>
    </Tag>
  );
}

export default HeatHaze;
