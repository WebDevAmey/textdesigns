"use client";

import { useState } from "react";
import { motion } from "motion/react";

/** A small plot of a cubic bezier with a dot that runs the curve on hover. */
export function EaseCurve({ name, curve }: { name: string; curve: readonly [number, number, number, number] }) {
  const [run, setRun] = useState(0);
  const [x1, y1, x2, y2] = curve;
  const s = 64;
  const p = (x: number, y: number) => `${4 + x * s} ${4 + (1 - y) * s}`;
  return (
    <button
      type="button"
      onPointerEnter={() => setRun((r) => r + 1)}
      onFocus={() => setRun((r) => r + 1)}
      className="group flex items-center gap-3 rounded-lg border p-3 text-left transition-colors duration-150 hover:border-foreground/25"
    >
      <svg width={s + 8} height={s + 8} viewBox={`0 0 ${s + 8} ${s + 8}`} aria-hidden="true" className="shrink-0 overflow-visible">
        <path d={`M ${p(0, 0)} L ${p(1, 1)}`} stroke="var(--tl-border)" strokeDasharray="2 3" fill="none" />
        <path d={`M ${p(0, 0)} C ${p(x1, y1)}, ${p(x2, y2)}, ${p(1, 1)}`} stroke="var(--tl-accent)" strokeWidth={2} fill="none" />
        <motion.circle key={run} r={3.5} fill="currentColor" cy={4 + s} initial={{ cx: 4, cy: 4 + s }} animate={{ cx: 4 + s, cy: 4 }} transition={{ cx: { duration: 0.9, ease: "linear" }, cy: { duration: 0.9, ease: [x1, y1, x2, y2] } }} />
      </svg>
      <span>
        <span className="block font-mono text-[13px]">{name}</span>
        <span className="block font-mono text-[11px] text-tertiary">{curve.join(", ")}</span>
      </span>
    </button>
  );
}
