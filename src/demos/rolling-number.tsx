"use client";

import { useState } from "react";
import { RollingNumber, type RollingNumberVariant } from "@registry/textlab/rolling-number/rolling-number";
import type { DemoProps } from "./registry";
import { DemoButton, DemoControls, DemoStage } from "./ui";

export default function RollingNumberDemo({ variant, props }: DemoProps) {
  const [value, setValue] = useState(2048);
  return (
    <DemoStage>
      <RollingNumber {...props} value={value} variant={variant as RollingNumberVariant} className="font-display text-[clamp(3rem,9vw,6rem)]" />
      <DemoControls>
        <DemoButton onClick={() => setValue((v) => v + 1)}>Add 1</DemoButton>
        <DemoButton onClick={() => setValue((v) => Math.max(0, v - 37))}>Take 37</DemoButton>
        <DemoButton onClick={() => setValue(Math.round(Math.random() * 99999))}>Random</DemoButton>
      </DemoControls>
    </DemoStage>
  );
}
