"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface CharacterRevealProps {
  text: string;
}

export default function CharacterReveal({
  text,
}: CharacterRevealProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    gsap.from(split.chars, {
      opacity: 0,
      x: 80,
      rotation:10,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h1
      ref={textRef}
      className="text-6xl font-normal tracking-tight"
    >
      {text}
    </h1>
  );
}