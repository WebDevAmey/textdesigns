"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface WordRevealProps {
  text: string;
  /** Stagger interval (default: 0.12s = stagger-dramatic) */
  stagger?: number;
}

export default function WordReveal({ text, stagger = 0.12 }: WordRevealProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "words",
    });

    gsap.from(split.words, {
      opacity: 0,
      y: 40,            /* 10 × unit */
      duration: 0.8,    /* duration-slow */
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