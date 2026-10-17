"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { CanvasText } from "../lib/canvas-text";
import { fitCanvas, rasterize } from "../lib/raster";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";
import type { TextShader } from "../lib/webgl";

export type NoiseDissolveVariant = "dissolve" | "burn";

export interface NoiseDissolveProps {
  text: string;
  /** dissolve fades through soft noise, burn eats the letters with a glowing ember edge. */
  variant?: NoiseDissolveVariant;
  /** Seconds to form or dissolve. */
  duration?: number;
  /** Dissolve on hover and re-form on leave. */
  hover?: boolean;
  /** Edge glow color for burn, as r, g, b from 0 to 1. */
  edge?: [number, number, number];
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * The title forms out of noise as it scrolls in, and dissolves back into it on hover. WebGL loads
 * lazily; without it, a soft CSS fade stands in.
 */
export function NoiseDissolve({ text, variant = "burn", duration = 1.4, hover = true, edge = [1, 0.45, 0.1], as, reducedMotion = "user", className, style }: NoiseDissolveProps) {
  const { ref: root, on } = useTrigger<HTMLElement>({ trigger: "inView", amount: 0.2 });
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const shader = useRef<TextShader | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReduced(reducedMotion);
  const threshold = useRef(1);
  const target = useRef(1);

  useEffect(() => {
    if (!on || reduced) return;
    target.current = 0;
    let disposed = false;
    let observer: ResizeObserver | null = null;
    import("./gl").then(({ createDissolve }) => {
      const node = root.current;
      const c = canvas.current;
      if (disposed || !node || !c) return;
      const s = createDissolve(c);
      if (!s) {
        setFailed(true);
        return;
      }
      shader.current = s;
      const build = () => {
        const { width, height, dpr } = fitCanvas(c);
        const raster = rasterize(node, text, width, height, { dpr, color: getComputedStyle(node).color });
        s.resize(c.width, c.height);
        s.setTexture(raster.canvas);
        s.uniform("u_scale", Math.max(4, width / 60));
        s.uniform("u_threshold", threshold.current);
        s.draw();
      };
      build();
      observer = new ResizeObserver(build);
      observer.observe(node);
      setReady(true);
    });
    return () => {
      disposed = true;
      observer?.disconnect();
      shader.current?.dispose();
      shader.current = null;
      setReady(false);
    };
  }, [on, reduced, text, root]);

  useFrame(
    (_, dt) => {
      const s = shader.current;
      if (!s) return;
      const before = threshold.current;
      const step = dt / duration;
      threshold.current = before + Math.max(-step, Math.min(step, target.current - before));
      if (before === threshold.current) return;
      s.uniform("u_threshold", threshold.current);
      s.uniform("u_edge", edge[0], edge[1], edge[2]);
      s.uniform("u_burn", variant === "burn" ? 1 : 0);
      s.draw();
    },
    { ref: root, enabled: ready },
  );

  const fallback = reduced || failed;
  return (
    <CanvasText
      text={text}
      as={as}
      className={className}
      style={style}
      rootRef={root}
      canvasRef={canvas}
      bleed={0.2}
      fallback={fallback ? text : undefined}
      canvasStyle={{ opacity: ready ? 1 : 0 }}
    >
      {!ready && !fallback && (
        // Until the shader arrives, a CSS fade keeps the title from popping in.
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, whiteSpace: "pre", opacity: on ? 1 : 0, filter: on ? "blur(0)" : "blur(6px)", transition: "opacity 0.6s, filter 0.6s" }}>
          {text}
        </span>
      )}
      {hover && ready && (
        <span
          aria-hidden="true"
          style={{ position: "absolute", inset: 0 }}
          onPointerEnter={() => {
            target.current = 0.35;
          }}
          onPointerLeave={() => {
            target.current = 0;
          }}
        />
      )}
    </CanvasText>
  );
}

export default NoiseDissolve;
