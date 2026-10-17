"use client";

import { useRef, type ReactNode, type RefObject } from "react";

/** A scrollable stage for scroll-driven demos, with room above and below the subject. */
export function ScrollBox({ children, hint = "Scroll inside the preview" }: { children: (container: RefObject<HTMLDivElement | null>) => ReactNode; hint?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={ref} className="relative h-[400px] w-full overflow-y-auto overscroll-contain" tabIndex={0} aria-label={hint}>
      <div className="flex h-[300px] items-end justify-center pb-6 font-sans text-xs tracking-normal text-tertiary">{hint} ↓</div>
      <div className="px-2">{children(ref)}</div>
      <div className="h-[340px]" />
    </div>
  );
}
