"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollRevealProps {
  text: string;
  splitBy?: "lines" | "words";
}

export default function ScrollReveal({
  text,
  splitBy = "lines",
}: ScrollRevealProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: splitBy === "lines" ? "lines" : "words",
    });

    const targets = splitBy === "lines" ? split.lines : split.words;

    gsap.from(targets, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    return () => split.revert();
  }, [text, splitBy]);

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}