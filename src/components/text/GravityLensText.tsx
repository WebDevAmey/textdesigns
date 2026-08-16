"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface GravityLensTextProps {
  text: string;
  /** px radius around the cursor within which characters are pulled in. */
  lensRadius?: number;
  /** How strongly characters are pulled toward the cursor, 0-1. */
  strength?: number;
  /** Extra scale applied at the lens edge (magnification), 0-1. */
  magnify?: number;
}

/**
 * Inverts the usual cursor-repel hover effect: characters near the
 * pointer are pulled inward and magnify slightly as they approach the
 * lens boundary — the actual visual signature of gravitational
 * lensing, where magnification (not just displacement) is strongest at
 * the edge. A ring tracking the cursor renders a thin
 * chromatic-dispersion fringe, like light splitting as it bends around
 * the lens. Idle (no ongoing physics) until the pointer is actually
 * near — pure event-driven quickTo, no ticker.
 */
export default function GravityLensText({
  text,
  lensRadius = 140,
  strength = 0.5,
  magnify = 0.35,
}: GravityLensTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const textEl = textRef.current;
    const ring = ringRef.current;
    if (!container || !textEl || !ring) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];

    const setters = chars.map((char) => ({
      x: gsap.quickTo(char, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(char, "y", { duration: 0.35, ease: "power3.out" }),
      scale: gsap.quickTo(char, "scale", { duration: 0.35, ease: "power3.out" }),
    }));

    const ringX = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      gsap.to(ring, { opacity: 1, duration: 0.2 });
      ringX(pointerX - lensRadius);
      ringY(pointerY - lensRadius);

      chars.forEach((char, i) => {
        const charRect = char.getBoundingClientRect();
        const cx = charRect.left + charRect.width / 2 - rect.left;
        const cy = charRect.top + charRect.height / 2 - rect.top;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < lensRadius) {
          const falloff = (1 - dist / lensRadius) ** 2;
          setters[i].x(dx * falloff * strength);
          setters[i].y(dy * falloff * strength);
          setters[i].scale(1 + falloff * magnify);
        } else {
          setters[i].x(0);
          setters[i].y(0);
          setters[i].scale(1);
        }
      });
    };

    const handleLeave = () => {
      gsap.to(ring, { opacity: 0, duration: 0.3 });
      chars.forEach((_, i) => {
        setters[i].x(0);
        setters[i].y(0);
        setters[i].scale(1);
      });
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      split.revert();
    };
  }, [text, lensRadius, strength, magnify, reducedMotion]);

  if (reducedMotion) {
    return <span className="inline-block">{text}</span>;
  }

  return (
    <div ref={containerRef} className="relative inline-block touch-none">
      <div
        ref={ringRef}
        className="pointer-events-none absolute rounded-full opacity-0"
        style={{
          width: lensRadius * 2,
          height: lensRadius * 2,
          boxShadow:
            "0 0 0 1px rgba(255,80,80,0.35), 0 0 0 2px rgba(80,220,255,0.3), 0 0 24px 4px rgba(140,120,255,0.15)",
          filter: "blur(0.5px)",
        }}
      />
      <h1 ref={textRef} className="relative inline-block">
        {text}
      </h1>
    </div>
  );
}
