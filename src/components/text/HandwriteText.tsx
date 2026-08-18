"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(useGSAP);

interface HandwriteTextProps {
  text?: string;
  /** Font size in viewBox units. */
  fontSize?: number;
  /** Ink color of the marker. */
  inkColor?: string;
  /** Font stack — defaults to handwriting-ish system faces. */
  fontFamily?: string;
}

const HAND_STACK =
  '"Bradley Hand", "Chalkboard SE", "Marker Felt", "Comic Sans MS", cursive';

interface WordLayout {
  word: string;
  x: number;
}

/**
 * Draws one continuous stroke per word instead of per character: each
 * word is a single `<text>` element whose own `getComputedTextLength()`
 * drives its `strokeDashoffset` reveal, so a five-letter word costs one
 * DOM node and one tween instead of five. That mirrors the cohesive,
 * non-staggered stroke @ncdai/apple-hello-effect's docs describe (they
 * normalize via SVG's `pathLength` attribute on `<path>` — this reaches
 * the same effect on `<text>`, which doesn't support `pathLength`, by
 * measuring each word's real rendered length directly). A pen dot
 * glides linearly from each word's start to its end in parallel with
 * the stroke, then hops to the next word — a plain tween, not a
 * per-frame recomputation.
 */
export default function HandwriteText({
  text = "good morning",
  fontSize = 120,
  inkColor = "currentColor",
  fontFamily = HAND_STACK,
}: HandwriteTextProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGCircleElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const reduceMotion = useReducedMotion();

  const [words, setWords] = useState<WordLayout[]>([]);
  const [layout, setLayout] = useState({ viewBox: "0 0 0 0", width: 0, height: 0 });

  const baseline = fontSize * 0.95;
  const penRadius = fontSize * 0.035;

  useGSAP(() => {
    const el = measureRef.current;
    if (!el || words.length > 0) return;

    const measure = () => {
      const bbox = el.getBBox();
      const pad = fontSize * 0.1;
      setLayout({
        viewBox: `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2,
      });

      const result: WordLayout[] = [];
      let index = 0;
      text.split(/(\s+)/).forEach((chunk) => {
        if (chunk.trim().length > 0) {
          result.push({ word: chunk, x: el.getStartPositionOfChar(index).x });
        }
        index += chunk.length;
      });
      setWords(result);
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
  }, [words, text, fontSize]);

  useGSAP(() => {
    if (words.length === 0 || reduceMotion) return;

    const elts = svgRef.current?.querySelectorAll<SVGTextElement>(".handwrite-word");
    const pen = penRef.current;
    if (!elts?.length || !pen) return;

    const lengths = Array.from(elts, (el) => Math.max(el.getComputedTextLength(), 1));

    gsap.set(pen, { opacity: 0 });
    gsap.set(elts, { fillOpacity: 0 });
    elts.forEach((el, i) => {
      gsap.set(el, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] });
    });

    const tl = gsap.timeline();
    const penY = baseline - fontSize * 0.06;
    let t = 0;

    words.forEach((w, i) => {
      const el = elts[i];
      const dur = 0.3 + Math.max(w.word.length - 1, 0) * 0.05;

      tl.set(pen, { x: w.x, y: penY }, t)
        .to(pen, { opacity: 1, duration: 0.04 }, t)
        .to(el, { strokeDashoffset: 0, duration: dur, ease: "power1.inOut" }, t)
        .to(pen, { x: w.x + lengths[i], duration: dur, ease: "power1.inOut" }, t)
        .to(el, { fillOpacity: 1, duration: 0.3, ease: "power2.out" }, t + dur * 0.8)
        .to(pen, { opacity: 0, duration: 0.05 }, t + dur);

      t += dur + 0.12;

      if (i < words.length - 1) {
        tl.to(
          pen,
          { x: words[i + 1].x, opacity: 0.4, duration: 0.1, ease: "power1.inOut" },
          t
        );
        t += 0.1;
      }
    });

    return () => {
      tl.kill();
    };
  }, [words, reduceMotion, fontSize]);

  if (reduceMotion) {
    return (
      <span className="inline-block select-none" style={{ fontFamily, fontSize }}>
        {text}
      </span>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={layout.viewBox}
      width={layout.width}
      height={layout.height}
      style={{ maxWidth: "100%", height: "auto" }}
      className="mx-auto overflow-visible"
    >
      <text
        ref={measureRef}
        x="0"
        y={baseline}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill="none"
        stroke="none"
      >
        {text}
      </text>
      {words.map((w, i) => (
        <text
          key={i}
          x={w.x}
          y={baseline}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fill={inkColor}
          stroke={inkColor}
          strokeWidth={fontSize * 0.055}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="handwrite-word"
        >
          {w.word}
        </text>
      ))}
      <circle ref={penRef} r={penRadius} fill={inkColor} className="handwrite-pen" />
    </svg>
  );
}
