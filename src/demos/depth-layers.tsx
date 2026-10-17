"use client";

import { DepthLayers, type DepthLayersVariant } from "@registry/textlab/depth-layers/depth-layers";
import type { DemoProps } from "./registry";
import { ScrollBox } from "./scroll-box";

export default function DepthLayersDemo({ variant, props }: DemoProps) {
  return (
    <ScrollBox>
      {(container) => (
        <DepthLayers
          {...props}
          text={(props.text as string) ?? "Parallax"}
          variant={variant as DepthLayersVariant}
          container={container}
          className="font-sans text-[clamp(3.5rem,11vw,7rem)] font-black tracking-[-0.04em]"
        />
      )}
    </ScrollBox>
  );
}
