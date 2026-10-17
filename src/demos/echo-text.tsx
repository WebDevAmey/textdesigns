"use client";

import { useEffect, useState } from "react";
import { EchoText, type EchoTextVariant } from "@registry/textlab/echo-text/echo-text";
import type { DemoProps } from "./registry";

const WORDS = ["Listen", "Repeat", "Echo", "Fade"];

export default function EchoTextDemo({ variant, props }: DemoProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 1800);
    return () => clearInterval(id);
  }, []);
  return <EchoText {...props} text={WORDS[i]} variant={variant as EchoTextVariant} className="font-display text-[clamp(3.5rem,10vw,6.5rem)]" />;
}
