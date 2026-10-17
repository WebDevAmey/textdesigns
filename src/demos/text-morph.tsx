"use client";

import { useState } from "react";
import { TextMorph, type TextMorphVariant } from "@registry/textlab/text-morph/text-morph";
import type { DemoProps } from "./registry";
import { DemoButton, DemoControls, DemoStage } from "./ui";

const STATES = ["Follow", "Following", "Unfollow"];

export default function TextMorphDemo({ variant }: DemoProps) {
  const [i, setI] = useState(0);
  return (
    <DemoStage>
      <TextMorph text={STATES[i]} variant={variant as TextMorphVariant} className="font-display text-[clamp(2.5rem,7vw,4.5rem)]" />
      <DemoControls>
        <DemoButton onClick={() => setI((n) => (n + 1) % STATES.length)}>Next state</DemoButton>
      </DemoControls>
    </DemoStage>
  );
}
