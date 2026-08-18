"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/** Half-width of the chromatic trail, in percent of the word. */
const BAND_HALF = 14;

const DEFAULT_COLORS = ["#60a5fa", "#818cf8", "#c084fc", "#fb7185", "#fbbf24"];

interface ChromaticTextProps {
  /** Fixed prefix, shown in the foreground color. */
  text: string;
  /** Words revealed one after another after the prefix. */
  words?: string[];
  /** Colors used along the moving chromatic edge. */
  colors?: string[];
  /** Color the text settles into after the sweep passes. */
  foregroundColor?: string;
  /** Sweep duration in seconds. */
  duration?: number;
  /** Delay before the first sweep, in seconds. */
  delay?: number;
  /** Rest after a word finishes revealing, in seconds. */
  pauseDuration?: number;
  /** Return to the first word after the final one. */
  loop?: boolean;
  className?: string;
}

function buildGradient(colors: string[], foreground: string): string {
  const n = colors.length;
  const stops = colors
    .map((color, i) => {
      const offset = n === 1 ? 0 : -BAND_HALF + (i / (n - 1)) * BAND_HALF * 2;
      const sign = offset < 0 ? "-" : "+";
      return `${color} calc(var(--chromatic-sweep) ${sign} ${Math.abs(offset).toFixed(2)}%)`;
    })
    .join(", ");

  return `linear-gradient(90deg, ${foreground} 0%, ${foreground} calc(var(--chromatic-sweep) - ${BAND_HALF}%), ${stops}, transparent calc(var(--chromatic-sweep) + ${BAND_HALF}%), transparent 100%)`;
}

export default function ChromaticText({
  text,
  words = [],
  colors = DEFAULT_COLORS,
  foregroundColor = "#000000",
  duration = 1.2,
  delay = 0,
  pauseDuration = 1.1,
  loop = true,
  className,
}: ChromaticTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);

  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
  const gradient = buildGradient(palette, foregroundColor);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useGSAP(() => {
    const wordEl = wordRef.current;
    if (!wordEl || reduceMotion || words.length === 0 || !inView) return;

    // The sweep is a single numeric cursor painted into the CSS
    // variable that the gradient's calc() stops read.
    const sweep = { value: -BAND_HALF };
    const paint = () => {
      wordEl.style.setProperty("--chromatic-sweep", `${sweep.value}%`);
    };

    const timeline = gsap.timeline({ repeat: loop ? -1 : 0, delay });

    words.forEach((word) => {
      timeline.add(() => {
        wordEl.textContent = word;
        gsap.set(wordEl, { opacity: 0.56, filter: "blur(6px)", y: 5 });
        sweep.value = -BAND_HALF;
        paint();
      });
      timeline
        .to(sweep, {
          value: 100 + BAND_HALF,
          duration,
          ease: "power2.inOut",
          onUpdate: paint,
        })
        .to(
          wordEl,
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.36,
            ease: "power2.out",
          },
          "<"
        )
        .to({}, { duration: pauseDuration });
    });

    return () => {
      timeline.kill();
    };
  }, [words, duration, delay, pauseDuration, loop, inView, reduceMotion]);

  if (reduceMotion) {
    return (
      <span className={cn("inline-flex items-baseline", className)}>
        <span className="whitespace-nowrap">{text}</span>
        {words.length > 0 && (
          <span className="whitespace-nowrap">&nbsp;{words[0]}</span>
        )}
      </span>
    );
  }

  return (
    <span ref={rootRef} className={cn("inline-flex items-baseline", className)}>
      <span className="whitespace-nowrap">
        {text}
        {words.length > 0 ? "\u00A0" : null}
      </span>
      {words.length > 0 && (
        <span className="relative inline-block select-none">
          <span aria-hidden className="invisible whitespace-nowrap">
            {longest}
          </span>
          <span
            ref={wordRef}
            aria-hidden
            className="absolute inset-y-0 left-0 whitespace-nowrap bg-clip-text text-transparent"
            style={
              {
                backgroundImage: gradient,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                "--chromatic-sweep": `-${BAND_HALF}%`,
                opacity: 0.56,
                filter: "blur(6px)",
                transform: "translateY(5px)",
              } as CSSProperties
            }
          />
          <span className="sr-only">{words.join(", ")}</span>
        </span>
      )}
    </span>
  );
}