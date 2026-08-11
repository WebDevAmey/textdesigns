"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface TypequakeTextProps {
  text: string;
}

export default function TypequakeText({
  text,
}: TypequakeTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      const split = new SplitType(textRef.current, {
        types: "chars",
      });

      const chars = split.chars;

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2,
      });

      chars.forEach((char, index) => {
        const delay = index * 0.075;

        timeline.to(
          char,
          {
            y: -32,
            x: gsap.utils.random(-8, 8),
            rotation: gsap.utils.random(-12, 12),
            scale: 1.12,
            duration: 0.12,
            ease: "power2.out",
          },
          delay
        );

        timeline.to(
          char,
          {
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.55,
            ease: "elastic.out(1, 0.6)",
          },
          delay + 0.12
        );
      });

      return () => {
        split.revert();
      };
    },
    { scope: textRef }
  );

  return (
    <h2
      ref={textRef}
      className="inline-block"
    >
      {text}
    </h2>
  );
}