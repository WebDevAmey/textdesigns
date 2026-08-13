"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

interface PathEntranceTextProps {
  text: string;
}

export default function PathEntranceText({ text }: PathEntranceTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    chars.forEach((char, i) => {
      const startX = gsap.utils.random(-200, 200);
      const startY = gsap.utils.random(-150, -60);

      gsap.set(char, { x: startX, y: startY, opacity: 0 });

      gsap.to(char, {
        motionPath: {
          path: [
            { x: startX, y: startY },
            { x: startX * 0.4, y: startY * 0.4 - 30 },
            { x: 0, y: 0 },
          ],
          curviness: 1.5,
        },
        opacity: 1,
        duration: 1.1,
        delay: i * 0.035,
        ease: "power2.inOut",
      });
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
