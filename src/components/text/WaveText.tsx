"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface WaveTextProps {
  text: string;
  /** Amplitude of the wave (default: 40px = 10 × unit) */
  amplitude?: number;
  /** Frequency multiplier (default: 0.8) */
  frequency?: number;
  /** Stagger interval (default: 0.04s) */
  stagger?: number;
}

export default function WaveText({
  text,
  amplitude = 40,
  frequency = 0.8,
  stagger = 0.04,
}: WaveTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    // Entrance — fall in with a gentle wave
    // y(i) = amplitude × sin(i × frequency)
    gsap.from(chars, {
      y: (index) => Math.sin(index * frequency) * amplitude,
      opacity: 0,
      duration: 1,        /* duration-slow */
      stagger: stagger,   /* stagger-normal */
      ease: "power3.out",  /* ease-out-quart */
    });

    // Tides — rise and fall 3 times, then settle
    // delay = 1.2s (duration-slow + gap)
    gsap.to(chars, {
      y: -14,              /* ~3.5 × unit */
      duration: 0.5,       /* duration-normal / 2 */
      delay: 1.2,
      stagger: {
        each: 0.08,        /* stagger-slow */
        repeat: 3,
        yoyo: true,
      },
      ease: "sine.inOut",  /* ease-in-out-quart */
    });

    return () => {
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