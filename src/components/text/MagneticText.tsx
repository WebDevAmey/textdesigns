"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface MagneticTextProps {
  text: string;
}

export default function MagneticText({
  text,
}: MagneticTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    const quickToX = chars.map((char) =>
      gsap.quickTo(char, "x", {
        duration: 0.4,
        ease: "power3.out",
      })
    );

    const quickToY = chars.map((char) =>
      gsap.quickTo(char, "y", {
        duration: 0.4,
        ease: "power3.out",
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

        const strength = Math.max(0, 1 - distance / 150);

        quickToX[index](distanceX * strength * 0.25);
        quickToY[index](distanceY * strength * 0.25);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      split.revert();
    };
  });

  return (
    <h1
      ref={textRef}
      className="inline-block"
    >
      {text}
    </h1>
  );
}