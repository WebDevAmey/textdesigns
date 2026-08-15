"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface TextTrailProps {
  text: string;
}

export default function TextTrail({
  text,
}: TextTrailProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = new SplitType(textRef.current, {
        types: "chars",
      });

      const chars = split.chars ?? [];

      chars.forEach((char, index) => {
        const trail = char.cloneNode(true) as HTMLElement;

        trail.className = char.className;

        trail.setAttribute("aria-hidden", "true");

        gsap.set(trail, {
          position: "absolute",
          left: char.offsetLeft,
          top: char.offsetTop,
          opacity: 0,
          pointerEvents: "none",
        });

        char.parentElement?.appendChild(trail);

        const timeline = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.4,
          delay: index * 0.08,
        });

        timeline.set(char, {
          x: 0,
        });

        timeline.to(char, {
          x: 40,
          duration: 0.5,
          ease: "power2.out",
        });

        timeline.to(
          trail,
          {
            opacity: 0.25,
            x: 20,
            duration: 0.15,
            ease: "power2.out",
          },
          "<"
        );

        timeline.to(
          trail,
          {
            opacity: 0,
            x: 0,
            duration: 0.45,
            ease: "power2.out",
          }
        );

        timeline.to(char, {
          x: 0,
          duration: 0.6,
          ease: "power3.out",
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
      className="relative inline-block"
    >
      {text}
    </h2>
  );
}