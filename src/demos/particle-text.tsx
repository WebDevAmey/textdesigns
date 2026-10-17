"use client";

import { ParticleText, type ParticleTextVariant } from "@registry/textlab/particle-text/particle-text";
import type { DemoProps } from "./registry";

export default function ParticleTextDemo({ variant, props }: DemoProps) {
  return <ParticleText {...props} text={(props.text as string) ?? "Stardust"} variant={variant as ParticleTextVariant} className="font-sans text-[clamp(4rem,12vw,8rem)] font-black leading-none tracking-[-0.03em]" />;
}
