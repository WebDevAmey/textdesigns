'use client';
import { TextRoll as TextRollUI } from "@/components/ui/text-roll";

interface TextRollProps {
  text?: string;
}

/**
 * TextRoll wrapper for the animation library.
 *
 * Default parameters:
 *   duration: 0.5s (duration-normal)
 *   stagger: 0.1s (stagger-normal)
 *   offset: 0.2s (gap between enter/exit)
 */
export default function TextRoll({ text = "Follow your Gut" }: TextRollProps) {
  return (
    <TextRollUI
      className="text-4xl text-black dark:text-white"
      duration={0.5}           /* duration-normal */
      getEnterDelay={(i) => i * 0.1}   /* stagger-normal */
      getExitDelay={(i) => i * 0.1 + 0.2} /* stagger-normal + 0.2s offset */
      transition={{ ease: 'easeIn' }}
    >
      {text}
    </TextRollUI>
  );
}
