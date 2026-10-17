"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { components, demos } from "@/demos/registry";
import { Segmented } from "./segmented";

export interface PreviewProps {
  name: string;
  variants: string[];
  preset?: Record<string, unknown>;
  /** Kept for callers; scroll demos manage their own scroll area. */
  scroll?: boolean;
  /** Fixed props, for example from the playground. */
  props?: Record<string, unknown>;
  height?: number;
}

/** A live stage for one component, with a variant switcher and a replay button. */
export function Preview({ name, variants, preset, props, height = 420 }: PreviewProps) {
  const [variant, setVariant] = useState(variants[0] ?? "");
  const [run, setRun] = useState(0);
  const Demo = demos[name];
  const Component = components[name];
  const merged = { ...preset, ...props, ...(variant ? { variant } : null) };

  return (
    <div className="overflow-hidden rounded-xl border bg-surface">
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        {variants.length > 1 ? (
          <Segmented size="sm" label="Variant" value={variant} options={variants} onChange={(v) => { setVariant(v); setRun((n) => n + 1); }} />
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          aria-label="Replay"
          className="group inline-flex size-8 items-center justify-center rounded-md text-secondary transition-[color,background-color,transform] duration-150 hover:bg-surface-2 hover:text-foreground active:scale-[0.94]"
        >
          <RotateCcw
            className="size-4 transition-transform duration-[400ms] ease-enter motion-reduce:transition-none"
            style={{ transform: `rotate(${-run * 360}deg)` }}
            strokeWidth={1.75}
          />
        </button>
      </div>
      <div
        className="relative flex w-full items-center justify-center overflow-hidden px-6"
        style={{ height }}
        data-preview-stage=""
      >
        <div key={`${variant}-${run}`} className="flex w-full max-w-3xl items-center justify-center text-center text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em]">
          {Demo ? <Demo variant={variant} props={merged} /> : Component ? <Component {...merged} /> : <p className="text-sm text-secondary">Preview unavailable</p>}
        </div>
      </div>
    </div>
  );
}
