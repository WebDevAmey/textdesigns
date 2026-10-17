"use client";

import { HoloText, type HoloTextVariant } from "@registry/textlab/holo-text/holo-text";
import type { DemoProps } from "./registry";

export default function HoloTextDemo({ variant, props }: DemoProps) {
  return <HoloText {...props} text={(props.text as string) ?? "Limited edition"} variant={variant as HoloTextVariant} className="font-sans text-[clamp(3rem,9vw,6rem)] font-extrabold tracking-[-0.03em]" />;
}
