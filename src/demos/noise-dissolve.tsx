"use client";

import { NoiseDissolve, type NoiseDissolveVariant } from "@registry/textlab/noise-dissolve/noise-dissolve";
import type { DemoProps } from "./registry";

export default function NoiseDissolveDemo({ variant, props }: DemoProps) {
  return <NoiseDissolve {...props} text={(props.text as string) ?? "Ashes"} variant={variant as NoiseDissolveVariant} className="font-display text-[clamp(5rem,16vw,11rem)] leading-none" />;
}
