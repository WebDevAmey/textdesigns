"use client";

import { DitherText, type DitherTextVariant } from "@registry/textlab/dither-text/dither-text";
import type { DemoProps } from "./registry";

export default function DitherTextDemo({ variant, props }: DemoProps) {
  return <DitherText {...props} text={(props.text as string) ?? "Print"} variant={variant as DitherTextVariant} className="font-display text-[clamp(6rem,18vw,12rem)] leading-none" />;
}
