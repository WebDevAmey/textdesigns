"use client";

import { ScrollSkew, type ScrollSkewVariant } from "@registry/textlab/scroll-skew/scroll-skew";
import type { DemoProps } from "./registry";
import { ScrollBox } from "./scroll-box";

export default function ScrollSkewDemo({ variant }: DemoProps) {
  return (
    <ScrollBox hint="Scroll fast inside the preview">
      {(container) => (
        <div className="space-y-10 py-10">
          {["Keep scrolling", "Feel the lean", "Then let go"].map((line) => (
            <ScrollSkew key={line} as="p" text={line} variant={variant as ScrollSkewVariant} container={container} className="font-display text-[clamp(2.5rem,7vw,4.5rem)]" />
          ))}
        </div>
      )}
    </ScrollBox>
  );
}
