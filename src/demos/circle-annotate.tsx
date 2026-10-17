"use client";

import { CircleAnnotate, type CircleAnnotateVariant } from "@registry/textlab/circle-annotate/circle-annotate";
import type { DemoProps } from "./registry";

export default function CircleAnnotateDemo({ variant }: DemoProps) {
  return (
    <p className="font-display text-[clamp(2rem,5.5vw,3.75rem)]">
      The only plan that <CircleAnnotate variant={variant as CircleAnnotateVariant} delay={0.3}>scales</CircleAnnotate> with you
    </p>
  );
}
