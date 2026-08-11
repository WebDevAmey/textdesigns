"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface FlipTextProps {
  text: string;
}

export default function FlipText({ text }: FlipTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    gsap.from(split.chars, {
      rotationX: -90,
      opacity: 0,
      transformOrigin: "50% 50% -20px",
      duration: 0.8,
      stagger: 0.06,
      ease: "back.out(1.7)",
    });

    return () => {
      split.revert();
    };
  });

  return (
    <div className="perspective-[600px]">
      <h1
        ref={textRef}
        className="inline-block"
      >
        {text}
      </h1>
    </div>
  );
}