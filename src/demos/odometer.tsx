"use client";

import { useState } from "react";
import { Odometer, type OdometerVariant } from "@registry/textlab/odometer/odometer";
import type { DemoProps } from "./registry";
import { DemoButton, DemoControls, DemoStage } from "./ui";

export default function OdometerDemo({ variant, props }: DemoProps) {
  const [value, setValue] = useState(48213);
  return (
    <DemoStage>
      <Odometer {...props} value={value} variant={variant as OdometerVariant} framed className="font-mono text-[clamp(2.5rem,8vw,5rem)]" />
      <DemoControls>
        <DemoButton onClick={() => setValue((v) => v + 1)}>Add 1</DemoButton>
        <DemoButton onClick={() => setValue((v) => v + 89)}>Drive 89</DemoButton>
        <DemoButton onClick={() => setValue((v) => v + 1250)}>Road trip</DemoButton>
      </DemoControls>
    </DemoStage>
  );
}
