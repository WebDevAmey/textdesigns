"use client";

import { TiltText, type TiltTextVariant } from "@registry/textlab/tilt-text/tilt-text";
import type { DemoProps } from "./registry";

export default function TiltTextDemo({ variant, props }: DemoProps) {
  return <TiltText {...props} text={(props.text as string) ?? "Depth"} variant={variant as TiltTextVariant} className="font-sans text-[clamp(4rem,13vw,8.5rem)] font-black tracking-[-0.04em]" />;
}
