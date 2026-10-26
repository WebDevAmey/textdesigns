"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@registry/textlab/lib/motion-tokens";

const emphasized = [...ease.emphasized] as [number, number, number, number];

/** Rises 8px out of a light blur the first time it scrolls into view. One shared reveal for every section. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, transform: "translateY(8px)", filter: "blur(4px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: emphasized }}
    >
      {children}
    </Tag>
  );
}

/** The hero's entrance: same motion, but on load instead of on view. */
export function Rise({ children, delay = 0, y = 8, blur = 0, className }: { children: ReactNode; delay?: number; y?: number; blur?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` }}
      animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay, ease: emphasized }}
    >
      {children}
    </motion.div>
  );
}
