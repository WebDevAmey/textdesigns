"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface WaveTextProps {
  text: string;
}

export default function WaveText({ text }: WaveTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    // Entrance — fall in with a gentle wave
    gsap.from(chars, {
      y: (index) => Math.sin(index * 0.8) * 40,
      opacity: 0,
      duration: 1,
      stagger: 0.04,
      ease: "power3.out",
    });

    // Tides — rise and fall a few times, then settle back to normal
    // (repeat 3 + yoyo ends the tween back at y: 0)
    gsap.to(chars, {
      y: -14,
      duration: 0.5,
      delay: 1.2,
      stagger: {
        each: 0.08,
        repeat: 3,
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