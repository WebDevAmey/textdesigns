"use client";

import { useMemo } from "react";
import RotatingText from "@/components/RotatingText/RotatingText";

interface RotateTextProps {
  text: string;
}

export default function RotateText({ text }: RotateTextProps) {
  const { staticWord, texts } = useMemo(() => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 1) {
      return { staticWord: words[0] ?? "", texts: [text] };
    }
    return { staticWord: words[0], texts: words.slice(1) };
  }, [text]);

  return (
    <span className="inline-flex items-baseline gap-2">
      <span>{staticWord}</span>
      <RotatingText texts={texts} />
    </span>
  );
}