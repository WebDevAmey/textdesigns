"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MorphingTextProps {
  text: string;
  /** Words to cycle through, morphing one into the next. Defaults to the given text plus a few. */
  words?: string[];
  /** Seconds each word stays on screen before morphing. */
  holdTime?: number;
  /** Seconds for one morph transition. */
  morphTime?: number;
}

const DEFAULT_WORDS = ["Morph", "Shift", "Flow", "Warp"];

export default function MorphingText({
  text,
  words = [text, ...DEFAULT_WORDS.filter((w) => w !== text)],
  holdTime = 1.6,
  morphTime = 0.45,
}: MorphingTextProps) {
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  useGSAP(() => {
    const elA = aRef.current;
    const elB = bRef.current;
    if (!elA || !elB) return;

    let active: HTMLSpanElement = elA;
    let inactive: HTMLSpanElement = elB;
    let currentIndex = 0;

    active.textContent = words[currentIndex % words.length];
    inactive.textContent = words[(currentIndex + 1) % words.length];
    gsap.set(active, { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 });
    gsap.set(inactive, { opacity: 0, scale: 0.85, filter: "blur(10px)", y: 14 });

    const timeline = gsap.timeline();

    const cycle = () => {
      const nextWord = words[(currentIndex + 1) % words.length];
      currentIndex += 1;

      timeline
        .to(active, {
          opacity: 0,
          scale: 1.15,
          filter: "blur(10px)",
          y: -14,
          duration: morphTime,
          ease: "power2.in",
        })
        .to(
          inactive,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            y: 0,
            duration: morphTime,
            ease: "power2.out",
          },
          "<0.2"
        )
        .add(() => {
          const swapped = active;
          active = inactive;
          inactive = swapped;
          inactive.textContent = nextWord;
          gsap.set(inactive, {
            opacity: 0,
            scale: 0.85,
            filter: "blur(10px)",
            y: 14,
          });
        })
        .to({}, { duration: holdTime })
        .add(cycle);
    };

    cycle();
  }, [words, holdTime, morphTime]);

  return (
    <span className="relative inline-block select-none whitespace-nowrap font-bold">
      <span className="invisible" aria-hidden>
        {longest}
      </span>
      <span ref={aRef} className="absolute left-0 top-0 will-change-transform" />
      <span ref={bRef} className="absolute left-0 top-0 will-change-transform" />
    </span>
  );
}