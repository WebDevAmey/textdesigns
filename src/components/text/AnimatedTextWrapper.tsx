"use client";
import { AnimatedText } from "@/components/ui/animated-text";

interface AnimatedTextWrapperProps {
  text?: string;
}

/**
 * AnimatedText wrapper for the animation library.
 *
 * Mathematical model:
 *   delay(i) = (i - n/2) × 0.25s (stagger-slow)
 *   duration = 1.5s (duration-cinematic)
 *   easing = cubic-bezier(0.37, 0, 0.63, 1) (ease-in-out-sine)
 */
export default function AnimatedTextWrapper({ text = "Font Design" }: AnimatedTextWrapperProps) {
  return (
    <AnimatedText
      text={text}
      fontSize={100}
      minWeight={0}
      maxWeight={840}
      animationDuration={1.5}
      delayMultiplier={0.25}
    />
  );
}
