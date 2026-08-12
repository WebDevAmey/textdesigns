"use client";

import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface StrokeDrawTextProps {
  text: string;
  fontSize?: number;
  strokeColor?: string;
  fillColor?: string;
}

const PAD_RATIO = 0.08;

export default function StrokeDrawText({
  text,
  fontSize = 120,
  strokeColor = "currentColor",
  fillColor = "currentColor",
}: StrokeDrawTextProps) {
  const textRef = useRef<SVGTextElement>(null);
  const fillRectRef = useRef<SVGRectElement>(null);

  const rawId = useId();
  const clipId = `strokedraw-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [layout, setLayout] = useState(() => {
    const w = text.length * fontSize * 0.55;
    const h = fontSize * 1.4;
    return {
      viewBox: `0 0 ${w} ${h}`,
      width: w,
      height: h,
      box: { x: 0, y: fontSize * 0.25, width: w, height: fontSize * 0.9 },
    };
  });

  useGSAP(() => {
    const el = textRef.current;
    const rect = fillRectRef.current;
    if (!el) return;

    const measure = () => {
      const bbox = el.getBBox();
      const pad = fontSize * PAD_RATIO;
      setLayout({
        viewBox: `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2,
        box: {
          x: bbox.x - pad,
          y: bbox.y - pad,
          width: bbox.width + pad * 2,
          height: bbox.height + pad * 2,
        },
      });
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);

    // Advance width is a reliable length for text; ×3 comfortably
    // exceeds the full outline so every glyph is drawn.
    const length = el.getComputedTextLength
      ? Math.max(el.getComputedTextLength() * 3, 2000)
      : 2000;

    gsap.set(el, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: "transparent",
    });

    gsap.to(el, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: "power2.inOut",
    });

    if (rect && fillColor) {
      // Fill spreads from the center of the text toward both ends.
      gsap.fromTo(
        rect,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.4,
          delay: 2.3,
          ease: "power2.inOut",
        }
      );
    }

    return () => {
      window.removeEventListener("resize", measure);
      gsap.killTweensOf(el);
      gsap.killTweensOf(rect);
    };
  }, [text, fillColor]);

  return (
    <svg
      viewBox={layout.viewBox}
      width={layout.width}
      height={layout.height}
      style={{ maxWidth: "100%", height: "auto" }}
      className="mx-auto"
    >
      <defs>
        <clipPath id={clipId}>
          <text x="0" y={fontSize} fontSize={fontSize} stroke="none">
            {text}
          </text>
        </clipPath>
      </defs>

      <text
        ref={textRef}
        x="0"
        y={fontSize}
        fontSize={fontSize}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        fill="transparent"
      >
        {text}
      </text>

      <g clipPath={`url(#${clipId})`}>
        <rect
          ref={fillRectRef}
          x={layout.box.x}
          y={layout.box.y}
          width={layout.box.width}
          height={layout.box.height}
          fill={fillColor}
          opacity="0"
        />
      </g>
    </svg>
  );
}
