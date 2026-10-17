"use client";

import { ScrollStretch, type ScrollStretchVariant } from "@registry/textlab/scroll-stretch/scroll-stretch";
import type { DemoProps } from "./registry";
import { ScrollBox } from "./scroll-box";

export default function ScrollStretchDemo({ variant, props }: DemoProps) {
  return (
    <ScrollBox hint="Flick the scroll inside the preview">
      {(container) => (
        <ScrollStretch
          {...props}
          text={(props.text as string) ?? "Elastic"}
          variant={variant as ScrollStretchVariant}
          container={container}
          className="font-sans text-[clamp(3.5rem,11vw,7rem)] font-black tracking-[-0.04em]"
        />
      )}
    </ScrollBox>
  );
}
