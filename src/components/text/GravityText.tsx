"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface GravityTextProps {
  text: string;
}

export default function GravityText({
  text,
}: GravityTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars;

    // Initial state
    gsap.set(chars, {
      transformOrigin: "50% 100%",
    });

    const timeline = gsap.timeline();

    /*
     * 1. ANTICIPATION
     *
     * The characters slightly lift before
     * gravity takes over.
     */
    timeline.to(chars, {
      y: -8,
      duration: 0.15,
      stagger: 0.015,
      ease: "power2.out",
    });

    /*
     * 2. GRAVITY
     *
     * Each character gets its own movement.
     *
     * x and rotation are related so the
     * randomness feels intentional.
     */
    timeline.to(chars, {
      y: () => gsap.utils.random(220, 480),

      x: () => {
        return gsap.utils.random(-90, 90);
      },

      rotation: () => {
        const direction = gsap.utils.random(-1, 1);
        return direction * gsap.utils.random(20, 80);
      },

      scale: () => gsap.utils.random(0.9, 1.05),

      duration: () => gsap.utils.random(0.8, 1.3),

      stagger: {
        each: 0.035,
        from: "random",
      },

      ease: "expo.in",
    });

    /*
     * 3. RETURN / IMPACT
     *
     * Characters come back towards the baseline.
     */
    timeline.to(chars, {
      y: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 1.1,

      stagger: {
        each: 0.025,
        from: "random",
      },

      ease: "power3.out",
    });

    /*
     * 4. IMPACT
     *
     * Tiny squash when the characters land.
     */
    timeline.to(chars, {
      scaleX: 1.08,
      scaleY: 0.84,
      duration: 0.09,
      stagger: 0.015,
      ease: "power2.out",
    });

    /*
     * 5. SETTLE
     *
     * Characters stretch back into their
     * original form with a subtle bounce.
     */
    timeline.to(chars, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.55,
      stagger: 0.015,
      ease: "elastic.out(1, 0.4)",
    });

    return () => {
      split.revert();
    };
  }, { scope: textRef });

  return (
    <h2
      ref={textRef}
      className="inline-block"
    >
      {text}
    </h2>
  );
}