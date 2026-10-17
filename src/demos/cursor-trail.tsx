"use client";

import { CursorTrail, type CursorTrailVariant } from "@registry/textlab/cursor-trail/cursor-trail";
import type { DemoProps } from "./registry";

export default function CursorTrailDemo({ variant, props }: DemoProps) {
  return (
    <CursorTrail
      {...props}
      text={(props.text as string) ?? "follow me"}
      variant={variant as CursorTrailVariant}
      className="flex h-[380px] w-full items-center justify-center rounded-lg"
      trailClassName="font-display text-[2.5rem] italic text-accent"
    >
      <p className="font-sans text-sm tracking-normal text-tertiary">Move your pointer around this area</p>
    </CursorTrail>
  );
}
