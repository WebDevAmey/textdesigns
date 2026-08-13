"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface CinematicZoomTextProps {
  text: string;
}

export default function CinematicZoomText({ text }: CinematicZoomTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    gsap.from(textRef.current, {
      scale: 3.2,
      opacity: 0,
      filter: "blur(20px)",
      transformOrigin: "50% 50%",
      duration: 1.4,
      ease: "power3.out",
    });
  });

  return (
    <div className="perspective-[800px]">
      <h1 ref={textRef} className="inline-block">
        {text}
      </h1>
    </div>
  );
}
