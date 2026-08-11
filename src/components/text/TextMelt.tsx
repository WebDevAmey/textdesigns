"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface TextMeltProps {
  text: string;
}

export default function TextMelt({
  text,
}: TextMeltProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      const split = new SplitType(textRef.current, {
        types: "chars",
      });

      const chars = split.chars;

      chars.forEach((char, index) => {
        const progress = index / Math.max(chars.length - 1, 1);

        const wave =
          Math.sin(progress * Math.PI);

        gsap.set(char, {
          transformOrigin: "center top",
        });

        const timeline = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.8,
          delay: index * 0.04,
        });

        /*
         * MELT
         */
        timeline.to(char, {
          y: 35 + wave * 55,
          rotation: gsap.utils.random(-12, 12),
          scaleY: 0.8,
          scaleX: 1.08,
          duration: 1.1,
          ease: "power2.inOut",
        });

        /*
         * SOFT HOLD
         */
        timeline.to(char, {
          y: "+=8",
          duration: 0.25,
          ease: "sine.inOut",
        });

        /*
         * REFORM
         */
        timeline.to(char, {
          y: 0,
          rotation: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.55)",
        });
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