"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface ScaleTextProps {
  text: string;
}

export default function ScaleText({ text }: ScaleTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    gsap.from(split.chars, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)",
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h1
      ref={textRef}
      className="text-6xl font-bold tracking-tight"
    >
      {text}
    </h1>
  );
}