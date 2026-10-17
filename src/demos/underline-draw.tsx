"use client";

import { UnderlineDraw, type UnderlineDrawVariant } from "@registry/textlab/underline-draw/underline-draw";
import type { DemoProps } from "./registry";

export default function UnderlineDrawDemo({ variant, props }: DemoProps) {
  return (
    <p className="font-display text-[clamp(2.25rem,6vw,4rem)]">
      Ship it{" "}
      <UnderlineDraw {...props} variant={variant as UnderlineDrawVariant} delay={0.2}>
        today
      </UnderlineDraw>
      , not someday
    </p>
  );
}
