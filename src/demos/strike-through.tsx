"use client";

import { StrikeThrough, type StrikeThroughVariant } from "@registry/textlab/strike-through/strike-through";
import type { DemoProps } from "./registry";

export default function StrikeThroughDemo({ variant }: DemoProps) {
  return (
    <p className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.6]">
      This meeting could have been an <StrikeThrough text="email" replacement="👍" variant={variant as StrikeThroughVariant} delay={0.3} />
    </p>
  );
}
