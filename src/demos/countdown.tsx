"use client";

import { useState } from "react";
import { Countdown, type CountdownVariant } from "@registry/textlab/countdown/countdown";
import type { DemoProps } from "./registry";

export default function CountdownDemo({ variant, props }: DemoProps) {
  // A fixed target a few days out, created once when the demo mounts.
  const [to] = useState(() => Date.now() + ((3 * 24 + 7) * 3600 + 42 * 60 + 18) * 1000);
  return <Countdown {...props} to={to} variant={variant as CountdownVariant} className="font-mono text-[clamp(2rem,6vw,4rem)] font-medium" />;
}
