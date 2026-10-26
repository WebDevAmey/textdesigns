"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { VariableProximity } from "@registry/textlab/variable-proximity/variable-proximity";

/**
 * "Textlab" set to fill the width exactly. It scrambles in once, then becomes variable proximity,
 * so the weight swells under the pointer.
 */
export function Wordmark() {
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);

  useLayoutEffect(() => {
    const el = box.current;
    const p = probe.current;
    if (!el || !p) return;
    // Measure the word at 100px at its heaviest weight (the pointer can swell it to 800), so it never overflows sideways.
    const fit = () => setSize((el.clientWidth / p.getBoundingClientRect().width) * 100 * 0.98);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  const style = { fontSize: size ? `${size}px` : "22vw" };
  return (
    <div ref={box} className="relative w-full">
      <span ref={probe} aria-hidden className="pointer-events-none invisible absolute whitespace-nowrap font-display text-[100px] tracking-[-0.06em] [font-variation-settings:'wght'_800]">
        Textlab
      </span>
      <p aria-label="Textlab" className="whitespace-nowrap text-center font-display font-semibold leading-[0.78] [letter-spacing:inherit]" style={style}>
        {settled ? (
          <VariableProximity text="Textlab" font="var(--font-bricolage)" from={500} to={800} radius={2.5} />
        ) : (
          <ScrambleText text="Textlab" trigger="inView" duration={1} onComplete={() => setTimeout(() => setSettled(true), 300)} />
        )}
      </p>
    </div>
  );
}
