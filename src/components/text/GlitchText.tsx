"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface GlitchTextProps {
  text: string;
}

export default function GlitchText({ text }: GlitchTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars;

    const glitch = () => {
      gsap.to(chars, {
        x: () => gsap.utils.random(-4, 4),
        y: () => gsap.utils.random(-3, 3),
        skewX: () => gsap.utils.random(-15, 15),
        opacity: () => gsap.utils.random(0.5, 1),
        duration: 0.08,
        stagger: 0.01,
        ease: "none",
        onComplete: () => {
          gsap.to(chars, {
            x: 0,
            y: 0,
            skewX: 0,
            opacity: 1,
            duration: 0.08,
            stagger: 0.01,
          });
        },
      });
    };

    const interval = setInterval(glitch, 1200);

    return () => {
      clearInterval(interval);
      split.revert();
    };
  });

  return (
    <h1
      ref={textRef}
      className="inline-block"
    >
      {text}
    </h1>
  );
}