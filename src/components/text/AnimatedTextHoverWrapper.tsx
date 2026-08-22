"use client";
import { AnimatedTextHover } from "@/components/ui/animated-text-hover";

interface AnimatedTextHoverWrapperProps {
  text?: string;
}

/**
 * AnimatedTextHover wrapper for the animation library.
 *
 * Mathematical model:
 *   delay(i) = (i - numLetters/2) × 0.04s (stagger-fast)
 *   duration = 0.6s (duration-normal × 2)
 *   easing = cubic-bezier(0.37, 0, 0.63, 1)
 */
export default function AnimatedTextHoverWrapper({ text = "Hover me" }: AnimatedTextHoverWrapperProps) {
  return (
    <AnimatedTextHover
      text={text}
      fontSize={100}
      minWeight={100}
      maxWeight={900}
      animationDuration={0.6}     /* duration-normal × 2 */
      staggerDelay={0.04}         /* stagger-fast */
    />
  );
}
