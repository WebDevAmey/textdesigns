"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/** Half-width of the moving color band, in percent of the text. */
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const DEFAULT_COLORS = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"];

interface ChromaticTextProps {
  /** Text to reveal. Pass multiple strings to rotate after each sweep. */
  text: string | string[];
  /** Colors sampled across the moving band. */
  colors?: string[];
  /** Color the text settles into once the band has passed. */
  textColor?: string;
  /** Duration of one sweep, in seconds. */
  duration?: number;
  /** Delay before the first sweep, in seconds. */
  delay?: number;
  /** Rest after a sweep completes before the next one, in seconds. */
  repeatDelay?: number;
  /** Advance through the text array after each sweep. */
  repeat?: boolean;
  className?: string;
}

function buildSweepGradient(
  pos: number,
  colors: string[],
  base: string
): string {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;
  const stops: string[] = [];

  if (bandStart > 0) {
    stops.push(`${base} 0%`, `${base} ${bandStart.toFixed(2)}%`);
  }

  colors.forEach((color, i) => {
    const pct =
      colors.length === 1
        ? pos
        : bandStart + (i / (colors.length - 1)) * BAND_HALF * 2;
    stops.push(`${color} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    stops.push(`transparent ${bandEnd.toFixed(2)}%`, "transparent 100%");
  }

  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

export default function ChromaticText({
  text,
  colors = DEFAULT_COLORS,
  textColor = "#000000",
  duration = 1.5,
  delay = 0,
  repeatDelay = 0.5,
  repeat = Array.isArray(text) && text.length > 1,
  className,
}: ChromaticTextProps) {
  const texts = Array.isArray(text) ? text : [text];
  const rootRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);

  const longest = texts.reduce((a, b) => (b.length > a.length ? b : a), "");
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useGSAP(() => {
    const wordEl = wordRef.current;
    if (!wordEl || reduceMotion || !inView) return;

    // A single numeric cursor is painted into the gradient on every
    // frame — no per-frame React renders.
    const sweep = { value: SWEEP_START };
    const paint = () => {
      wordEl.style.backgroundImage = buildSweepGradient(
        sweep.value,
        palette,
        textColor
      );
    };

    const timeline = gsap.timeline({
      repeat: repeat && texts.length > 1 ? -1 : 0,
      delay,
    });

    texts.forEach((word) => {
      timeline.add(() => {
        wordEl.textContent = word;
        sweep.value = SWEEP_START;
        paint();
      });
      timeline.to(sweep, {
        value: SWEEP_END,
        duration,
        ease: "power3.inOut",
        onUpdate: paint,
      });
      if (repeat && texts.length > 1) {
        timeline.to({}, { duration: repeatDelay });
      }
    });

    return () => {
      timeline.kill();
    };
  }, [texts, palette, textColor, duration, delay, repeatDelay, repeat, inView, reduceMotion]);

  if (reduceMotion) {
    return (
      <span className={cn("inline-block", className)}>{texts[0]}</span>
    );
  }

  return (
    <span
      ref={rootRef}
      className={cn(
        "relative inline-block select-none whitespace-nowrap align-bottom leading-[100%]",
        className
      )}
    >
      <span aria-hidden className="invisible">
        {longest}
      </span>
      <span
        ref={wordRef}
        aria-hidden
        className="absolute inset-y-0 left-0 whitespace-nowrap bg-clip-text text-transparent"
        style={
          {
            backgroundImage: buildSweepGradient(SWEEP_START, palette, textColor),
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            transform: "translateY(-2px)",
          } as CSSProperties
        }
      />
      <span className="sr-only">{texts.join(", ")}</span>
    </span>
  );
}