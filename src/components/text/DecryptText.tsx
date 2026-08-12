"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface DecryptTextProps {
  text: string;
  duration?: number;
  glyphs?: string;
}

const DEFAULT_GLYPHS =
  "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function DecryptText({
  text,
  duration = 1.6,
  glyphs = DEFAULT_GLYPHS,
}: DecryptTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const el = textRef.current;
    const original = text.split("");
    const revealed = new Array(original.length).fill(false);

    const proxy = { progress: 0 };

    const tween = gsap.to(proxy, {
      progress: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const revealCount = Math.floor(proxy.progress * original.length);

        const output = original
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealCount) {
              revealed[i] = true;
              return char;
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");

        el.textContent = output;
      },
      onComplete: () => {
        el.textContent = text;
      },
    });

    return () => tween.kill();
  }, [text, duration, glyphs]);

  return (
    <h1 ref={textRef} className="inline-block font-mono">
      {text}
    </h1>
  );
}