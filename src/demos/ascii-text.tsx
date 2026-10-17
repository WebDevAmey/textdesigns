"use client";

import { AsciiText, type AsciiTextVariant } from "@registry/textlab/ascii-text/ascii-text";
import type { DemoProps } from "./registry";

export default function AsciiTextDemo({ variant, props }: DemoProps) {
  return <AsciiText {...props} text={(props.text as string) ?? "ASCII"} variant={variant as AsciiTextVariant} className="font-sans text-[clamp(5rem,16vw,10rem)] font-black leading-none tracking-[-0.04em]" />;
}
