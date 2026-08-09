"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface TypewriterTextProps {
  text: string;
}

export default function TypewriterText({
  text,
}: TypewriterTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!textRef.current || !cursorRef.current) return;

    const element = textRef.current;

    const timeline = gsap.timeline({
      repeat: -1,
    });

    timeline
      .to(element, {
        width: "100%",
        duration: text.length * 0.08,
        ease: "none",
      })
      .to({}, { duration: 1 })
      .to(element, {
        width: "0%",
        duration: text.length * 0.05,
        ease: "none",
      })
      .to({}, { duration: 0.5 });

    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  });

  return (
    <div className="flex items-center">
      <span className="relative inline-block overflow-hidden whitespace-nowrap">
        <span
          ref={textRef}
          className="inline-block overflow-hidden"
        >
          {text}
        </span>
      </span>

      <span
        ref={cursorRef}
        className="ml-1 inline-block h-10 w-0.5 bg-current"
      />
    </div>
  );
}