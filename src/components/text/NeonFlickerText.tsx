"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface NeonFlickerTextProps {
  text: string;
  /** Glow color of the tube. */
  glowColor?: string;
  /** Seconds for one full glow hum cycle. */
  humDuration?: number;
}

export default function NeonFlickerText({
  text,
  glowColor = "#22d3ee",
  humDuration = 2.4,
}: NeonFlickerTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const haloRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const halo = haloRef.current;
    if (!root || !halo) return;

    // The tube: mostly steady, with micro flickers and the occasional
    // longer outage a dying tube would have.
    gsap
      .timeline({ repeat: -1, repeatDelay: 1.8 })
      .to(root, { opacity: 0.7, duration: 0.4, ease: "sine.inOut" })
      .to(root, { opacity: 1, duration: 0.5, ease: "sine.inOut" })
      .to({}, { duration: 0.8 })
      .to(root, { opacity: 0, duration: 0.03 })
      .to(root, { opacity: 1, duration: 0.035 })
      .to(root, { opacity: 0, duration: 0.02 })
      .to(root, { opacity: 1, duration: 0.03 })
      .to(root, { opacity: 0, duration: 0.12 })
      .to(root, { opacity: 1, duration: 0.4, ease: "power1.in" });

    // The halo breathes gently while the tube flickers above it.
    gsap.to(halo, {
      opacity: 0.6,
      duration: humDuration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });

  return (
    <span ref={rootRef} className="relative inline-block select-none">
      <span
        ref={haloRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          color: glowColor,
          filter: "blur(12px)",
          opacity: 0.35,
          textShadow: `0 0 1em ${glowColor}`,
        }}
      >
        {text}
      </span>
      <span
        className="font-bold"
        style={{
          color: glowColor,
          textShadow: `0 0 0.06em ${glowColor}, 0 0 0.3em ${glowColor}`,
        }}
      >
        {text}
      </span>
    </span>
  );
}