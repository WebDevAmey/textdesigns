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

    const state = {
      progress: 0,
    };

    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
    });

    // Start empty
    gsap.set(element, {
      textContent: "",
    });

    // Cursor blinking
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)",
    });

    // Typing
    timeline.to(state, {
      progress: text.length,
      duration: text.length * 0.075,
      ease: "none",

      onUpdate: () => {
        const count = Math.floor(state.progress);

        element.textContent = text.slice(0, count);
      },
    });

    // Hold completed text
    timeline.to({}, {
      duration: 1.2,
    });

    // Delete
    timeline.to(state, {
      progress: 0,
      duration: text.length * 0.035,
      ease: "none",

      onUpdate: () => {
        const count = Math.floor(state.progress);

        element.textContent = text.slice(0, count);
      },
    });

  });

  return (
    <span className="inline-flex items-center">
      <span ref={textRef} />

      <span
        ref={cursorRef}
        className="ml-1 inline-block h-[1em] w-[2px] bg-current"
      />
    </span>
  );
}