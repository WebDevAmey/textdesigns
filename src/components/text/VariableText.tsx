"use client";

import { useEffect, useRef } from "react";

interface VariableProximityTextProps {
  text: string;
  radius?: number; // px, distance at which the effect fully fades out
  fromWeight?: number;
  toWeight?: number;
  fromWidth?: number;
  toWidth?: number;
  falloff?: "linear" | "gaussian";
  /**
   * Set true only if the loaded font actually exposes variable axes
   * (wght/wdth). When false, falls back to a scale + letter-spacing
   * proximity effect so the component still looks intentional on
   * regular static fonts.
   */
  isVariableFont?: boolean;
}

/**
 * Letters respond to cursor distance by interpolating font-variation-settings
 * (or a scale/spacing fallback for static fonts).
 *
 * Extra touches beyond the usual version of this effect:
 * - works with normal fonts too via the scale/letter-spacing fallback,
 *   so it isn't dead on arrival if a variable font isn't loaded yet
 * - single requestAnimationFrame loop shared across all letters (not one
 *   listener/loop per character) for smoother performance on longer strings
 * - gaussian falloff option for a softer, more organic response curve
 * - automatically stops the rAF loop when the cursor is far from the
 *   element to avoid animating an idle page
 */
export default function VariableProximityText({
  text,
  radius = 120,
  fromWeight = 400,
  toWeight = 900,
  fromWidth = 100,
  toWidth = 125,
  falloff = "gaussian",
  isVariableFont = true,
}: VariableProximityTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number | null>(null);
  const active = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const falloffFn = (t: number) =>
      falloff === "gaussian" ? Math.exp(-((t * 2.2) ** 2)) : Math.max(0, 1 - t);

    const loop = () => {
      let anyActive = false;

      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(mouse.current.x - cx, mouse.current.y - cy);
        const t = Math.min(dist / radius, 1);
        const strength = falloffFn(t);

        if (strength > 0.01) anyActive = true;

        if (isVariableFont) {
          const weight = fromWeight + (toWeight - fromWeight) * strength;
          const width = fromWidth + (toWidth - fromWidth) * strength;
          el.style.fontVariationSettings = `"wght" ${weight.toFixed(
            1
          )}, "wdth" ${width.toFixed(1)}`;
        } else {
          const scale = 1 + 0.25 * strength;
          const spacing = strength * 2;
          el.style.transform = `scale(${scale.toFixed(3)})`;
          el.style.letterSpacing = `${spacing.toFixed(2)}px`;
          el.style.fontWeight = strength > 0.5 ? "700" : "400";
        }
      });

      if (anyActive) {
        rafId.current = requestAnimationFrame(loop);
      } else {
        active.current = false;
      }
    };

    const ensureLoop = () => {
      if (!active.current) {
        active.current = true;
        rafId.current = requestAnimationFrame(loop);
      }
    };

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      ensureLoop();
    };

    const handleLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      ensureLoop();
    };

    window.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [radius, fromWeight, toWeight, fromWidth, toWidth, falloff, isVariableFont]);

  return (
    <h1 ref={containerRef} className="inline-block select-none">
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          className="inline-block transition-none"
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}