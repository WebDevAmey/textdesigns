"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface FadeTextProps {
  text: string;
  duration?: number; // Optional prop, falls back to a default
  delay?: number;    // Optional prop, defaults to 0
}

export default function FadeText({ text, duration = 2, delay = 0 }: FadeTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.from(textRef.current, {
      opacity: 0,
      y: 50,
      duration: duration, // Uses your prop value
      delay: delay,       // Uses your prop value
      ease: "back.out", // back.out , power3.out power2.out power4.out elastic.out bounce.out 
    });
  });

  return (
    <h1 ref={textRef} className="text-6xl font-bold tracking-tight">
      {text}
    </h1>
  );
}
