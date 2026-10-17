"use client";

import { PixelSort, type PixelSortVariant } from "@registry/textlab/pixel-sort/pixel-sort";
import type { DemoProps } from "./registry";

export default function PixelSortDemo({ variant, props }: DemoProps) {
  return <PixelSort {...props} text={(props.text as string) ?? "Corrupted"} variant={variant as PixelSortVariant} className="font-sans text-[clamp(4rem,12vw,8rem)] font-black leading-none tracking-[-0.04em]" />;
}
