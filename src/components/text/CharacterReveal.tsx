"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface CharacterRevealProps {
  text: string;
  /** Stagger interval (default: 0.05s = stagger-normal) */
  stagger?: number;
}

export default function CharacterReveal({
  text,
  stagger = 0.05,
}: CharacterRevealProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    gsap.from(split.chars, {
      opacity: 0,
      x: 80,           /* 20 × unit */
      rotation: 10,    /* 10° */
      duration: 0.8,   /* duration-slow */
      stagger: stagger,
      ease: "power3.out", /* ease-out-quart */
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