"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface TideTextProps {
  text: string;
}

export default function TideText({ text }: TideTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    gsap.set(chars, {
      transformOrigin: "center center",
    });

    const wave = {
      amplitude: 28,
      wavelength: 2.8,
      speed: 1.6,
      cycles: 3,
    };

    const state = {
      progress: 0,
    };

    const applyWave = () => {
      const total = Math.PI * 2 * wave.cycles;

      // Envelope: gradual rise, hold at full amplitude, then one
// continuous gradual decrease — each segment joined with zero
// velocity so the motion never kinks
      const p = state.progress / total;

      const s01 = (t: number) => t * t * (3 - 2 * t);

      let envelope: number;
      if (p < 0.35) {
        envelope = s01(p / 0.35);
      } else if (p < 0.65) {
        envelope = 1;
      } else {
        envelope = 1 - s01((p - 0.65) / 0.35);
      }

      chars.forEach((char, index) => {
        const phase =
          state.progress +
          (index / Math.max(chars.length - 1, 1)) *
            Math.PI *
            wave.wavelength;

        const y =
          Math.sin(phase) * wave.amplitude * envelope;

        const rotation = Math.cos(phase) * 8 * envelope;

        const scale = 1 + Math.sin(phase) * 0.04 * envelope;

        gsap.set(char, {
          y,
          rotation,
          scale,
        });
      });
    };

    // Wave cycles that fade in and out, then settle back to the
    // normal position, pause, and repeat the loop
    gsap
      .timeline({
        repeat: -1,
        repeatDelay: 2,
      })
      .to(state, {
        progress: Math.PI * 2 * wave.cycles,
        duration: wave.speed * wave.cycles,
        ease: "none",
        onUpdate: applyWave,
      })
      .to(
        chars,
        {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.inOut",
          stagger: 0.04,
        },
        "<+0.3"
      );

    return () => {
      split.revert();
    };
  });

  return (
    <h2
      ref={textRef}
      className="inline-block whitespace-nowrap"
    >
      {text}
    </h2>
  );
}