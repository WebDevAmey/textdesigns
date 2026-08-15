"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, Flip);

interface LetterShuffleTextProps {
  text: string;
}

export default function LetterShuffleText({ text }: LetterShuffleTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(chars, { opacity: 0 });
      gsap.to(chars, { opacity: 1, duration: 0.3, ease: "power1.out" });
      return () => {
        split.revert();
      };
    }

    gsap.set(chars, {
      x: () => gsap.utils.random(-120, 120),
      y: () => gsap.utils.random(-60, 60),
      rotation: () => gsap.utils.random(-90, 90),
      opacity: 0,
    });

    const state = Flip.getState(chars);

    gsap.set(chars, { x: 0, y: 0, rotation: 0, opacity: 1 });

    Flip.from(state, {
      targets: chars,
      duration: 0.8,
      stagger: 0.03,
      ease: "power3.out",
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
