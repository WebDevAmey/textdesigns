"use client";

import { AppleHelloEffectEnglish } from "@/components/apple-hello-effect-english";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Wraps the officially installed @ncdai/apple-hello-effect component
 * (`pnpm dlx shadcn add @ncdai/apple-hello-effect`, its real
 * distribution channel) so it fits this catalog's `{ text: string }`
 * contract. The effect always draws the word "Hello" from hand-drawn
 * cursive SVG paths — it ignores `text` entirely, since that hand-drawn
 * path data (not font rendering) is what gives it authentic parity
 * with Apple's original animation.
 */
export default function AppleHelloText({}: { text: string }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <span className="inline-block text-6xl font-semibold">Hello</span>;
  }

  return <AppleHelloEffectEnglish className="h-24 md:h-32" />;
}
