"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// A heavy, settling curve: content eases up out of a slight blur and lands without overshoot.
const settle = [0.32, 0.72, 0, 1] as const;

/** Fades a block up into place the first time it scrolls into view. Uses IntersectionObserver under the hood. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, transform: "translateY(24px)", filter: "blur(8px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [...settle] }}
    >
      {children}
    </Tag>
  );
}
