"use client";

import { MarkerHighlight, type MarkerHighlightVariant } from "@registry/textlab/marker-highlight/marker-highlight";
import type { DemoProps } from "./registry";

export default function MarkerHighlightDemo({ variant }: DemoProps) {
  return (
    <p className="max-w-xl font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.2]">
      Good tools get out of the way. <MarkerHighlight variant={variant as MarkerHighlightVariant} delay={0.2}>Great ones make the work feel lighter</MarkerHighlight> than it is.
    </p>
  );
}
