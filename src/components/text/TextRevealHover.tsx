"use client";
import { TextReveal } from "@/components/ui/cascade-text";

interface TextRevealHoverProps {
  text?: string;
}

/**
 * TextRevealHover wrapper for the animation library.
 *
 * Mathematical model:
 *   delay(i) = i × 25ms (stagger-fast)
 *   duration = 250ms (duration-fast × 1.67)
 *   easing = ease-in-out
 */
export default function TextRevealHover({ text = "Hover me" }: TextRevealHoverProps) {
  return (
    <div className="flex items-center justify-center w-full min-h-[200px]">
      <TextReveal
        text={text}
        fontSize="3rem"
        staggerDelay={25}       /* stagger-fast */
        duration={250}          /* duration-fast × 1.67 */
        easing="ease-in-out"
        direction="up"
      />
    </div>
  );
}
