"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERIES = ["(prefers-reduced-motion: reduce)", "(min-width: 768px)"];
const canAnimate = () => !matchMedia(QUERIES[0]).matches && matchMedia(QUERIES[1]).matches;
const subscribe = (fn: () => void) => {
  const lists = QUERIES.map((q) => matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", fn));
  return () => lists.forEach((l) => l.removeEventListener("change", fn));
};

type Props = {
  /** Characters from dark to light. */
  chars: string;
  /** Static fallback shown when motion is reduced or the screen is narrow. */
  still: string;
  /** CSS mask that fades the field out before it reaches the text. */
  mask: string;
  parallax?: number;
  className?: string;
};

/**
 * The ASCII texture from landing-effects, drawn from a wave of our own effect names. The library is
 * imported only when the field is about to be seen, stops when it scrolls away, and is replaced by a
 * still image under reduced motion or below 768px.
 */
export function AsciiField({ chars, still, mask, parallax = 5, className = "" }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const allowed = useSyncExternalStore(subscribe, canAnimate, () => null);
  const live = allowed === null ? null : allowed && !failed;

  useEffect(() => {
    const el = canvas.current;
    if (!live || !el) return;
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    const start = async () => {
      const { createAsciiRenderer } = await import("landing-effects");
      if (cancelled || cleanup) return;
      // Canvas fonts cannot read CSS variables, so resolve next/font's generated family name first.
      const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "monospace";
      try {
        cleanup = createAsciiRenderer({ canvas: el, imageSrc: "/landing/ascii-source.png", chars, fontSize: 9, fontFamily: mono, brightnessBoost: 1.9, posterize: 16, parallaxStrength: parallax, scale: 1.05 });
      } catch {
        setFailed(true);
      }
    };
    const stop = () => {
      cleanup?.();
      cleanup = null;
    };
    // Only run while on screen; the renderer has its own animation loop.
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    // A fixed footer always intersects the viewport, so watch its in-flow placeholder instead.
    observer.observe(el.closest("footer") ?? el);
    return () => {
      cancelled = true;
      observer.disconnect();
      stop();
    };
  }, [live, chars, parallax]);

  const style = { maskImage: mask, WebkitMaskImage: mask };
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={style}>
      {live === false && <Image src={still} alt="" fill sizes="100vw" className="object-cover invert dark:invert-0" />}
      {/* The library tints its glyphs blue; grayscale makes them neutral, and light mode inverts them to ink. */}
      {live && <canvas ref={canvas} className="size-full opacity-50 grayscale invert dark:opacity-45 dark:invert-0" />}
    </div>
  );
}
