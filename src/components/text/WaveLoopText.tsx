"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface WaveLoopTextProps {
  text: string;
}

export default function WaveLoopText({
  text,
}: WaveLoopTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    gsap.to(split.chars, {
      y: -15,
      duration: 0.6,
      stagger: {
        each: 0.08,
        repeat: -1,
        yoyo: true,
      },
      ease: "sine.inOut",
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