"use client";

import { ExtrudeText, type ExtrudeTextVariant } from "@registry/textlab/extrude-text/extrude-text";
import type { DemoProps } from "./registry";

export default function ExtrudeTextDemo({ variant, props }: DemoProps) {
  return <ExtrudeText {...props} text={(props.text as string) ?? "Press"} variant={variant as ExtrudeTextVariant} className="font-sans text-[clamp(4rem,12vw,8rem)] font-black tracking-[-0.03em]" />;
}
