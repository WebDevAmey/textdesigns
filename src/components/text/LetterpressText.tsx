"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface LetterpressTextProps {
  text: string;
  inkColor?: string;
  /** Opacity of the always-visible ghost outline stroke, 0-1. */
  ghostOpacity?: number;
  /** Multiplier on the stamp impact's squash/overshoot, 0-2ish. */
  impactStrength?: number;
}

/**
 * Characters begin as ghost impressions — a faint, constant stroke
 * outline with no fill — and get stamped with ink as you scroll past
 * them: a quick squash-and-overshoot (the press impact) followed by a
 * blur-to-sharp settle (ink bleed soaking in and drying). The whole
 * sequence is scrubbed directly to scroll position rather than played
 * once, so scrolling back up visibly lifts the ink back off, character
 * by character, in reverse.
 */
export default function LetterpressText({
  text,
  inkColor = "currentColor",
  ghostOpacity = 0.28,
  impactStrength = 1,
}: LetterpressTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const textEl = textRef.current;
    if (!textEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];

    gsap.set(chars, {
      color: "transparent",
      webkitTextStroke: `1px rgba(0,0,0,${ghostOpacity})`,
      scaleY: 1,
      y: 0,
      filter: "blur(0px)",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textEl,
        start: "top 85%",
        end: "bottom 45%",
        scrub: 0.4,
      },
    });

    chars.forEach((char, i) => {
      const start = i * 0.05;
      tl.set(char, { filter: "blur(6px)", color: "transparent", scaleY: 1, y: 0 }, start)
        .to(
          char,
          {
            filter: "blur(1px)",
            color: inkColor,
            scaleY: 1 - 0.22 * impactStrength,
            y: 2 * impactStrength,
            duration: 0.14,
            ease: "power1.out",
          },
          start
        )
        .to(
          char,
          {
            filter: "blur(0px)",
            scaleY: 1 + 0.08 * impactStrength,
            y: -1 * impactStrength,
            duration: 0.1,
            ease: "power1.out",
          },
          start + 0.14
        )
        .to(char, { scaleY: 1, y: 0, duration: 0.12, ease: "power2.out" }, start + 0.24);
    });

    return () => {
      split.revert();
    };
  }, [text, inkColor, ghostOpacity, impactStrength]);

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
