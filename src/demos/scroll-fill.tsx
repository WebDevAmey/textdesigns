"use client";

import { ScrollFill, type ScrollFillVariant } from "@registry/textlab/scroll-fill/scroll-fill";
import type { DemoProps } from "./registry";
import { ScrollBox } from "./scroll-box";

export default function ScrollFillDemo({ variant, props }: DemoProps) {
  return (
    <ScrollBox>
      {(container) => (
        <ScrollFill
          {...props}
          text={props.text as string}
          variant={variant as ScrollFillVariant}
          container={container}
          offset={["start 0.9", "end 0.5"]}
          className="mx-auto max-w-2xl text-left font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15]"
        />
      )}
    </ScrollBox>
  );
}
