"use client";

import { ShaderRipple, type ShaderRippleVariant } from "@registry/textlab/shader-ripple/shader-ripple";
import type { DemoProps } from "./registry";

export default function ShaderRippleDemo({ variant, props }: DemoProps) {
  return <ShaderRipple {...props} text={(props.text as string) ?? "Surface"} variant={variant as ShaderRippleVariant} className="font-display text-[clamp(5rem,15vw,10rem)] leading-none" />;
}
