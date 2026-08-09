"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface WordRevealProps {
  text: string;
}

export default function WordReveal({ text }: WordRevealProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "words",
    });

    gsap.from(split.words, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });

    return () => {
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