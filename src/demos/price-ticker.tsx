"use client";

import { useEffect, useState } from "react";
import { PriceTicker, type PriceTickerVariant } from "@registry/textlab/price-ticker/price-ticker";
import type { DemoProps } from "./registry";
import { DemoButton, DemoControls, DemoStage } from "./ui";

const START: Record<PriceTickerVariant, number> = { currency: 184.32, percent: 0.0412, compact: 48200 };

export default function PriceTickerDemo({ variant, props }: DemoProps) {
  const v = variant as PriceTickerVariant;
  const [value, setValue] = useState(START[v]);
  const [live, setLive] = useState(true);
  const nudge = (dir: number) => setValue((x) => Math.max(0, x * (1 + dir * (0.002 + Math.random() * 0.01))));
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => nudge(Math.random() > 0.45 ? 1 : -1), 1800);
    return () => clearInterval(id);
  }, [live]);
  return (
    <DemoStage>
      <PriceTicker {...props} value={value} variant={v} className="font-display text-[clamp(2.5rem,8vw,5rem)]" />
      <DemoControls>
        <DemoButton onClick={() => nudge(1)}>Rise</DemoButton>
        <DemoButton onClick={() => nudge(-1)}>Fall</DemoButton>
        <DemoButton onClick={() => setLive((l) => !l)}>{live ? "Pause feed" : "Resume feed"}</DemoButton>
      </DemoControls>
    </DemoStage>
  );
}
