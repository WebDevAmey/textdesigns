"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MarqueeTextProps {
  text: string;
  speed?: number; // seconds per loop
  direction?: "left" | "right";
}

const COPY_COUNT = 6;

export default function MarqueeText({
  text,
  speed = 8,
  direction = "left",
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const distance = track.scrollWidth / COPY_COUNT;

    gsap.fromTo(
      track,
      { x: direction === "left" ? 0 : -distance },
      {
        x: direction === "left" ? -distance : 0,
        duration: speed,
        ease: "none",
        repeat: -1,
      }
    );
  }, [speed, direction]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap"
    >
      <div ref={trackRef} className="inline-flex w-max">
        {Array.from({ length: COPY_COUNT }).map((_, index) => (
          <span
            key={index}
            className="mx-4 inline-block"
            aria-hidden={index > 0}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}