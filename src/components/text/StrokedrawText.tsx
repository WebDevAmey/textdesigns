"use client";

import { useRef, useState } from "react";
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

  const [layout, setLayout] = useState(() => ({
    viewBox: `0 0 ${text.length * fontSize * 0.55} ${fontSize * 1.4}`,
    width: text.length * fontSize * 0.55,
    height: fontSize * 1.4,
  }));

  useGSAP(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const bbox = el.getBBox();
      const pad = fontSize * PAD_RATIO;
      setLayout({
        viewBox: `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2,
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

    if (fillColor) {
      gsap.to(el, {
        fill: fillColor,
        duration: 0.7,
        delay: 2.4,
        ease: "power1.out",
      });
    }

    return () => {
      window.removeEventListener("resize", measure);
      gsap.killTweensOf(el);
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
    </svg>
  );
}
