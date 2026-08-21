"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface FadeTextProps {
  text: string;
  /** Animation duration in seconds (default: 1.5s = duration-cinematic) */
  duration?: number;
  /** Delay before animation starts (default: 0s) */
  delay?: number;
  /** Vertical offset for entrance (default: 50px = 12.5 × unit) */
  y?: number;
}

export default function FadeText({
  text,
  duration = 1.5,
  delay = 0,
  y = 50,
}: FadeTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.from(textRef.current, {
      opacity: 0,
      y: y,               /* Default: 50px ≈ 12.5 × unit */
      duration: duration, /* Default: 1.5s = duration-cinematic */
      delay: delay,
      ease: "back.out",   /* ease-out-back */
    });
  });

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
