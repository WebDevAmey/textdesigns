"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface PressureWriteTextProps {
  text: string;
  fontSize?: number;
  inkColor?: string;
  /** How much per-character stroke width varies from the base pressure curve, 0-1. */
  pressureVariance?: number;
}

const BASE_STROKE = 3;
const PAD_RATIO = 0.12;

function measureCharWidths(text: string, font: string): number[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.split("").map(() => 0);
  ctx.font = font;
  return text.split("").map((ch) => ctx.measureText(ch).width);
}

/**
 * Each character draws itself as an SVG stroke outline (the same
 * technique StrokeDrawText uses for a whole line), but per character
 * and with stroke-width modulated live against a seeded pressure
 * curve — thin at the start and end of a stroke, fuller in the
 * middle — approximating pen velocity rather than true glyph-outline
 * pressure. A blurred duplicate stroke fades in behind each character
 * as it draws and dissipates just after, like ink bleeding into paper
 * and drying, and word boundaries get a short pause simulating the pen
 * lifting off the page.
 */
export default function PressureWriteText({
  text,
  fontSize = 120,
  inkColor = "currentColor",
  pressureVariance = 0.15,
}: PressureWriteTextProps) {
  const strokeRefs = useRef<(SVGTextElement | null)[]>([]);
  const bleedRefs = useRef<(SVGTextElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  const chars = useMemo(() => text.split(""), [text]);

  const layout = useMemo(() => {
    const pad = fontSize * PAD_RATIO;
    if (typeof document === "undefined") {
      const fallbackWidth = fontSize * 0.6;
      return {
        width: chars.length * fallbackWidth + pad * 2,
        height: fontSize * 1.5,
        xs: chars.map((_, i) => pad + i * fallbackWidth),
      };
    }
    const font = `700 ${fontSize}px system-ui, sans-serif`;
    const widths = measureCharWidths(text, font);
    let cursor = pad;
    const xs = widths.map((w) => {
      const x = cursor;
      cursor += w;
      return x;
    });
    return { width: cursor + pad, height: fontSize * 1.5, xs };
  }, [text, fontSize, chars]);

  useGSAP(() => {
    if (reducedMotion) return;

    let cursorTime = 0;

    chars.forEach((char, i) => {
      const isSpace = char === " ";
      const nextIsSpace = chars[i + 1] === " ";

      if (isSpace) {
        cursorTime += 0.12;
        return;
      }

      const strokeEl = strokeRefs.current[i];
      const bleedEl = bleedRefs.current[i];
      if (!strokeEl) return;

      const length = Math.max(strokeEl.getComputedTextLength() * 3, 40);
      const variance = Math.random() * 2 - 1;
      const drawDuration = 0.22 + Math.abs(variance) * 0.08;

      gsap.set(strokeEl, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: "transparent",
      });
      if (bleedEl) gsap.set(bleedEl, { opacity: 0 });

      const drawTween = gsap.to(strokeEl, {
        strokeDashoffset: 0,
        duration: drawDuration,
        delay: cursorTime,
        ease: "power1.inOut",
        onUpdate: () => {
          const bump = Math.sin(drawTween.progress() * Math.PI);
          const jitter = 1 + variance * pressureVariance;
          strokeEl.setAttribute(
            "stroke-width",
            String(BASE_STROKE * (0.4 + bump * 1.3) * jitter)
          );
        },
      });

      if (bleedEl) {
        gsap.fromTo(
          bleedEl,
          { opacity: 0.5 },
          {
            opacity: 0,
            duration: 0.5,
            delay: cursorTime + drawDuration * 0.4,
            ease: "power2.out",
          }
        );
      }

      cursorTime += drawDuration + (nextIsSpace ? 0.18 : 0.05);
    });
  }, [text, fontSize, pressureVariance, layout, reducedMotion]);

  if (reducedMotion) {
    return (
      <span className="inline-block font-bold" style={{ fontSize }}>
        {text}
      </span>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={layout.width}
      height={layout.height}
      style={{ maxWidth: "100%", height: "auto" }}
      className="mx-auto overflow-visible"
    >
      {chars.map((char, i) =>
        char === " " ? null : (
          <text
            key={`bleed-${i}`}
            ref={(el) => {
              bleedRefs.current[i] = el;
            }}
            x={layout.xs[i]}
            y={layout.height * 0.72}
            fontSize={fontSize}
            fontWeight={700}
            fill={inkColor}
            style={{ filter: "blur(6px)" }}
          >
            {char}
          </text>
        )
      )}
      {chars.map((char, i) =>
        char === " " ? null : (
          <text
            key={`stroke-${i}`}
            ref={(el) => {
              strokeRefs.current[i] = el;
            }}
            x={layout.xs[i]}
            y={layout.height * 0.72}
            fontSize={fontSize}
            fontWeight={700}
            stroke={inkColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            fill="transparent"
          >
            {char}
          </text>
        )
      )}
    </svg>
  );
}
