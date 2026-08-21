"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface MagneticTextProps {
  text: string;
  /** Interaction radius in pixels (default: 150px) */
  radius?: number;
  /** Strength multiplier (default: 0.25) */
  strength?: number;
}

export default function MagneticText({
  text,
  radius = 150,
  strength = 0.25,
}: MagneticTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    // Quick-to functions for smooth cursor following
    // duration: 0.4s = duration-moderate
    const quickToX = chars.map((char) =>
      gsap.quickTo(char, "x", {
        duration: 0.4,  /* duration-moderate */
        ease: "power3.out", /* ease-out-quart */
      })
    );

    const quickToY = chars.map((char) =>
      gsap.quickTo(char, "y", {
        duration: 0.4,  /* duration-moderate */
        ease: "power3.out", /* ease-out-quart */
      })
    );

    const handleMouseMove = (event: MouseEvent) => {
      chars.forEach((char, index) => {
        const rect = char.getBoundingClientRect();

        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const distanceX = event.clientX - charX;
        const distanceY = event.clientY - charY;

        const distance = Math.sqrt(
          distanceX ** 2 + distanceY ** 2
        );

        // Strength decreases with distance (inverse relationship)
        const strengthFactor = Math.max(0, 1 - distance / radius);

        quickToX[index](distanceX * strengthFactor * strength);
        quickToY[index](distanceY * strengthFactor * strength);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      split.revert();
    };
  });

  return (
    <span
      ref={textRef}
      className="inline-block"
    >
      {text}
    </span>
  );
}