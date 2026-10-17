"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Docs UI motion follows the OS reduced-motion setting: transforms are dropped, fades stay. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
