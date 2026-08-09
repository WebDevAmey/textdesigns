"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ScrambleTextProps {
  text: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

export default function ScrambleText({ text }: ScrambleTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const originalText = text;

    const scramble = {
      progress: 0,
    };

    const updateText = () => {
      const progress = scramble.progress;

      const revealedCount = Math.floor(
        progress * originalText.length
      );

      const result = originalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";

          if (index < revealedCount) {
            return char;
          }

          return characters[
            Math.floor(Math.random() * characters.length)
          ];
        })
        .join("");

      element.textContent = result;
    };

    gsap.to(scramble, {
      progress: 1,
      duration: 2,
      ease: "none",
      onUpdate: updateText,
    });
  });

  return (
    <span
      ref={textRef}
      className="font-mono text-6xl font-bold tracking-tight"
    >
      {text}
    </span>
  );
}