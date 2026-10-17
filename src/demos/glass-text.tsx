"use client";

import { GlassText, type GlassTextVariant } from "@registry/textlab/glass-text/glass-text";
import type { DemoProps } from "./registry";

export default function GlassTextDemo({ variant, props }: DemoProps) {
  return (
    <GlassText
      {...props}
      text={(props.text as string) ?? "Clarity"}
      variant={variant as GlassTextVariant}
      className="font-sans text-[clamp(4rem,13vw,8.5rem)] font-black tracking-[-0.04em]"
      style={{ padding: "0.25em 0.5em" }}
    />
  );
}
