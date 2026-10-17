"use client";

import { useEffect, useState } from "react";
import { SplitFlap, type SplitFlapVariant } from "@registry/textlab/split-flap/split-flap";
import type { DemoProps } from "./registry";
import { DemoButton, DemoControls, DemoStage } from "./ui";

const CITIES = ["LISBON", "KYOTO", "REYKJAVIK", "OAXACA", "TBILISI", "HOBART"];

export default function SplitFlapDemo({ variant, props }: DemoProps) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % CITIES.length), 3200);
    return () => clearInterval(id);
  }, [auto]);
  return (
    <DemoStage>
      <SplitFlap {...props} text={CITIES[index]} length={9} variant={variant as SplitFlapVariant} className="font-mono text-[clamp(1.75rem,5vw,3.25rem)] font-medium" />
      <DemoControls>
        <DemoButton onClick={() => { setAuto(false); setIndex((i) => (i + 1) % CITIES.length); }}>Next city</DemoButton>
        <DemoButton onClick={() => setAuto((a) => !a)}>{auto ? "Pause" : "Play"}</DemoButton>
      </DemoControls>
    </DemoStage>
  );
}
