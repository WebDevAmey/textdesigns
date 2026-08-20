"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface GooeyTextProps {
  text?: string;
  /** Seconds between blob cycles. */
  interval?: number;
}

/**
 * Letters melt together into a single gooey blob, wobble,
 * then snap back into place — on a continuous loop.
 */
export default function GooeyText({ text = "GOOEY", interval = 2.4 }: GooeyTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rawId = useId();
  const filterId = "gooey" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  useGSAP(
    () => {
      const chars = charRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null
      );
      if (chars.length < 2) return;

      const center = (chars.length - 1) / 2;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: interval });

      // Melt toward the centre — neighbours overlap and fuse into one blob.
      tl.to(chars, {
        x: (i) => `${(center - i) * 0.55}em`,
        scaleY: 1.55,
        scaleX: 0.88,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: { each: 0.035, from: "center" },
      });

      // The blob wobbles while merged.
      tl.to(chars, {
        scaleY: 1.3,
        scaleX: 0.96,
        duration: 0.22,
        ease: "sine.inOut",
        stagger: 0.012,
      });
      tl.to(chars, {
        scaleY: 1.5,
        scaleX: 0.9,
        duration: 0.18,
        ease: "sine.inOut",
        stagger: 0.012,
      });

      // Snap back apart with a springy release.
      tl.to(chars, {
        x: 0,
        scaleY: 1,
        scaleX: 1,
        duration: 0.9,
        ease: "elastic.out(1, 0.45)",
        stagger: { each: 0.05, from: "edges" },
      });

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <span
      ref={containerRef}
      className="relative inline-block select-none leading-none"
      style={{ filter: "url(#" + filterId + ")" }}
      aria-label={text}
    >
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id={filterId} x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -13"
            />
          </filter>
        </defs>
      </svg>
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className="inline-block will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}