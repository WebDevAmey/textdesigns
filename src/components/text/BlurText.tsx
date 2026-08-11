"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface BlurTextProps {
  text: string;
}

export default function BlurText({ text }: BlurTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    gsap.from(textRef.current, {
      opacity: 0,
      filter: "blur(20px)",  // can try variations with scale and blur 
      scale: 1.1,
      duration: 1.5,
      ease: "power3.out",
    });
  });

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
