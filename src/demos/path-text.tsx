"use client";

import { PathText, type PathTextVariant } from "@registry/textlab/path-text/path-text";
import type { DemoProps } from "./registry";

export default function PathTextDemo({ variant, props }: DemoProps) {
  const v = variant as PathTextVariant;
  return (
    <PathText
      {...props}
      text={(props.text as string) ?? "Text that follows the line"}
      variant={v}
      className={v === "wave" ? "w-full max-w-2xl font-display" : "w-[300px] font-sans font-medium uppercase"}
    />
  );
}
