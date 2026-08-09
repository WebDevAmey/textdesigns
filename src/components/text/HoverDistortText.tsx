"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface HoverDistortTextProps {
  text: string;
}

export default function HoverDistortText({
  text,
}: HoverDistortTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    const handleEnter = (char: HTMLElement) => {
      gsap.to(char, {
        y: -12,
        scale: 1.15,
        rotation: gsap.utils.random(-8, 8),
        skewX: gsap.utils.random(-10, 10),
        duration: 0.3,
        ease: "back.out(2)",
      });
    };

    const handleLeave = (char: HTMLElement) => {
      gsap.to(char, {
        y: 0,
        scale: 1,
        rotation: 0,
        skewX: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    };

    chars.forEach((char) => {
      char.addEventListener("mouseenter", () =>
        handleEnter(char)
      );

      char.addEventListener("mouseleave", () =>
        handleLeave(char)
      );
    });

    return () => {
      chars.forEach((char) => {
        char.replaceWith(char.cloneNode(true));
      });

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