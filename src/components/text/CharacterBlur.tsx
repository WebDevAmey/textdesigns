"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface CharacterBlurProps {
  text: string;
}

export default function CharacterBlur({ text }: CharacterBlurProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    gsap.from(split.chars, {
      opacity: 0,
      filter: "blur(10px)",
      y: 30,
      duration: 1,
      stagger: 0.04,
      ease: "power3.out",
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