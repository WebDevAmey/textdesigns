"use client";

import { useEffect, useRef } from "react";

interface DisplacementTextProps {
  text?: string;
  /** Max lift in px at the cursor's center. */
  strength?: number;
  /** Falloff radius in px. */
  radius?: number;
  className?: string;
}

export default function DisplacementText({
  text = "DISPLACEMENT",
  strength = 22,
  radius = 120,
  className = "",
}: DisplacementTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  // Direct style writes on pointer move — zero React re-renders. Each glyph
  // lifts and thins by gaussian falloff from the cursor; a transform
  // transition smooths the field as the cursor travels. Mouse-only by
  // design; touch and reduced-motion get static text.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const glyphs = Array.from(
      container.querySelectorAll<HTMLSpanElement>("[data-glyph]")
    );

    function onMove(e: MouseEvent) {
      for (const glyph of glyphs) {
        const rect = glyph.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);
        const force = Math.exp(-(dist * dist) / (2 * radius * radius));
        const lift = -strength * force;
        const tilt = (dx / radius) * -14 * force;
        glyph.style.transform =
          "translateY(" +
          lift.toFixed(1) +
          "px) rotate(" +
          tilt.toFixed(1) +
          "deg) scaleY(" +
          (1 + 0.28 * force).toFixed(3) +
          ")";
        glyph.style.opacity = String(
          0.55 + 0.45 * Math.min(1, force * 2)
        );
      }
    }

    function onLeave() {
      for (const glyph of glyphs) {
        glyph.style.transform = "";
        glyph.style.opacity = "";
      }
    }

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, radius]);

  return (
    <span
      ref={containerRef}
      className={
        "inline-flex cursor-default select-none py-6 text-4xl font-medium leading-none tracking-tight text-current " +
        className
      }
    >
      <span className="sr-only">{text}</span>
      {text.split("").map((char, i) => (
        <span
          key={i}
          data-glyph
          aria-hidden
          className="inline-block will-change-transform"
          style={{
            transition:
              "transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.28s",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}