"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface SlotRollTextProps {
  text: string;
}

export default function SlotRollText({ text }: SlotRollTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll<HTMLSpanElement>(
      "[data-char-inner]"
    );

    gsap.from(chars, {
      yPercent: 100,
      duration: 0.8,
      stagger: 0.04,
      ease: "power4.out",
    });
  }, [text]);

  return (
    <h1 ref={containerRef} className="inline-flex overflow-hidden">
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span data-char-inner className="inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </h1>
  );
}