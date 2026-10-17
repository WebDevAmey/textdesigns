"use client";

import { WordRotator, type WordRotatorVariant } from "@registry/textlab/word-rotator/word-rotator";
import type { DemoProps } from "./registry";

export default function WordRotatorDemo({ variant, props }: DemoProps) {
  const words = (props.words as string[]) ?? ["designers", "engineers", "writers", "everyone"];
  return (
    <p className="font-display text-[clamp(2.25rem,6vw,4rem)]">
      Built for <WordRotator words={words} variant={variant as WordRotatorVariant} className="italic text-accent" />
    </p>
  );
}
