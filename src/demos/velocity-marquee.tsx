"use client";

import { VelocityMarquee, type VelocityMarqueeVariant } from "@registry/textlab/velocity-marquee/velocity-marquee";
import type { DemoProps } from "./registry";
import { ScrollBox } from "./scroll-box";

export default function VelocityMarqueeDemo({ variant, props }: DemoProps) {
  return (
    <ScrollBox hint="Scroll up and down inside the preview">
      {(container) => (
        <VelocityMarquee
          {...props}
          text={(props.text as string) ?? "Available for new projects"}
          variant={variant as VelocityMarqueeVariant}
          container={container}
          className="-mx-6 py-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]"
        />
      )}
    </ScrollBox>
  );
}
