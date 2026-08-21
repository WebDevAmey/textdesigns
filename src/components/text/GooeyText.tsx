"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface GooeyTextProps {
  text: string;
  /** The word the text melts into on hover. */
  text2?: string;
}

/**
 * Two stacked SVG text layers under a goo filter (blur → alpha-boosted
 * color matrix → crisp source composited on top). On hover the blur
 * pulses 0 → 1 → 0 while the layers crossfade, so the first word melts
 * into the second like a single drop of liquid. Based on the Codrops
 * Gooey Text Hover Effect.
 */
export default function GooeyText({ text, text2 = "LIQUID" }: GooeyTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const text1Ref = useRef<SVGTextElement>(null);
  const text2Ref = useRef<SVGTextElement>(null);
  const rawId = useId();
  const filterId = "gooey-hover" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  const fontSize = 100;
  const maxDeviation = fontSize / 16;
  const charWidth = 0.62 * fontSize;
  const viewWidth = Math.max(text.length, text2.length) * charWidth;
  const viewHeight = fontSize * 1.3;

  useGSAP(
    () => {
      const prim = { stdDeviation: 0 };
      const tl = gsap.timeline({
        paused: true,
        onUpdate: () =>
          blurRef.current?.setAttribute(
            "stdDeviation",
            String(prim.stdDeviation)
          ),
        onComplete: () => {
          if (groupRef.current) groupRef.current.style.filter = "none";
        },
        onReverseComplete: () => {
          if (groupRef.current) groupRef.current.style.filter = "none";
        },
      });
      tl.to(
          prim,
          { stdDeviation: maxDeviation, duration: 0.8, ease: "none" },
          0
        )
        .to(
          prim,
          { stdDeviation: 0, duration: 0.8, ease: "none" },
          0.8
        )
        .to(text1Ref.current, { opacity: 0, duration: 1.6, ease: "none" }, 0)
        .fromTo(
          text2Ref.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.6, ease: "none" },
          0
        );

      const enter = () => {
        if (groupRef.current) {
          groupRef.current.style.filter = `url(#${filterId})`;
        }
        tl.play();
      };
      const leave = () => {
        if (groupRef.current) {
          groupRef.current.style.filter = `url(#${filterId})`;
        }
        tl.reverse();
      };

      wrapperRef.current?.addEventListener("mouseenter", enter);
      wrapperRef.current?.addEventListener("mouseleave", leave);
      return () => {
        wrapperRef.current?.removeEventListener("mouseenter", enter);
        wrapperRef.current?.removeEventListener("mouseleave", leave);
        tl.kill();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      className="inline-block select-none leading-none"
      style={{ cursor: "pointer" }}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMinYMid meet"
        style={{
          width: `${viewWidth / fontSize}em`,
          height: "1.3em",
          display: "block",
          overflow: "visible",
          fill: "currentColor",
          fontSize: `${fontSize}px`,
        }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              ref={blurRef}
              in="SourceGraphic"
              stdDeviation="0"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  1 0 1 0 0  0 0 0 15 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        <g ref={groupRef}>
          <text
            ref={text1Ref}
            x="0"
            y={fontSize * 1.05}
            style={{ fontWeight: 800 }}
          >
            {text}
          </text>
          <text
            ref={text2Ref}
            x="0"
            y={fontSize * 1.05}
            style={{ fontWeight: 800, opacity: 0 }}
          >
            {text2}
          </text>
        </g>
      </svg>
    </div>
  );
}