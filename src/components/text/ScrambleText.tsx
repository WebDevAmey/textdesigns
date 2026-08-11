"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ScrambleTextProps {
  text: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export default function ScrambleText({
  text,
}: ScrambleTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      const element = textRef.current;

      const state = {
        progress: 0,
      };

      const timeline = gsap.timeline();

      timeline.to(state, {
        progress: text.length,
        duration: 1.4,
        ease: "none",

        onUpdate: () => {
          const resolved = Math.floor(state.progress);

          let output = "";

          for (let i = 0; i < text.length; i++) {
            if (i < resolved) {
              output += text[i];
            } else {
              output +=
                characters[
                  Math.floor(
                    Math.random() * characters.length
                  )
                ];
            }
          }

          element.textContent = output;
        },

        onComplete: () => {
          element.textContent = text;
        },
      });

    },
    { scope: textRef }
  );

  return (
    <span
      ref={textRef}
      className="inline-block whitespace-pre"
    >
      {text}
    </span>
  );
}