"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { CanvasText } from "../lib/canvas-text";
import { hashString, seeded } from "../lib/math";
import { noise2 } from "../lib/noise";
import { fitCanvas, rasterize, type Raster } from "../lib/raster";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type PixelSortVariant = "sort" | "smear";

export interface PixelSortProps {
  text: string;
  /** sort slides bands of rows into register, smear pulls long streaks out of each row and retracts them. */
  variant?: PixelSortVariant;
  /** Seconds the image takes to settle. */
  duration?: number;
  /** Re-glitch briefly on hover. */
  hover?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Rows sort into place like a glitch artwork. The title starts torn into sliding bands or streaks
 * and settles into clean type; hover tears it again for a moment.
 */
export function PixelSort({ text, variant = "smear", duration = 1.4, hover = true, as, reducedMotion = "user", className, style }: PixelSortProps) {
  const { ref: root, on } = useTrigger<HTMLElement>({ trigger: "inView" });
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const src = useRef<{ raster: Raster; rows: Float32Array; out: ImageData } | null>(null);
  const amount = useRef(1);
  const target = useRef(1);
  const idle = useRef(false);

  const draw = (time: number) => {
    const c = canvas.current;
    const s = src.current;
    if (!c || !s) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h, data } = s.raster;
    const out = s.out.data;
    out.fill(0);
    const k = amount.current;
    for (let y = 0; y < h; y++) {
      const row = y * w * 4;
      if (variant === "sort") {
        // Bands of rows share one offset, quantised so they move in visible steps.
        const band = Math.floor(y / Math.max(2, h / 28));
        const n = noise2(band * 0.7, time * 0.6) - 0.5;
        const shift = Math.round(n * w * 0.35 * k * k);
        for (let x = 0; x < w; x++) {
          const sx = x - shift;
          if (sx < 0 || sx >= w) continue;
          const si = row + sx * 4;
          const di = row + x * 4;
          out[di] = data[si];
          out[di + 1] = data[si + 1];
          out[di + 2] = data[si + 2];
          out[di + 3] = data[si + 3];
        }
      } else {
        const len = s.rows[y] * w * 0.6 * k;
        let lastX = -1e9;
        let lastA = 0;
        for (let x = 0; x < w; x++) {
          const i = row + x * 4;
          const a = data[i + 3];
          if (a > 40) {
            lastX = x;
            lastA = a;
            out[i] = data[i];
            out[i + 1] = data[i + 1];
            out[i + 2] = data[i + 2];
            out[i + 3] = a;
          } else if (len > 0 && x - lastX < len) {
            out[i] = data[i];
            out[i + 1] = data[i + 1];
            out[i + 2] = data[i + 2];
            out[i + 3] = Math.max(a, lastA * (1 - (x - lastX) / len));
          }
        }
      }
    }
    ctx.putImageData(s.out, 0, 0);
  };

  useEffect(() => {
    const node = root.current;
    const c = canvas.current;
    if (!node || !c || reduced) return;
    const build = () => {
      const { width, height, dpr } = fitCanvas(c, Math.min(1.5, window.devicePixelRatio || 1));
      const raster = rasterize(node, text, width, height, { dpr, color: getComputedStyle(node).color });
      const rand = seeded(hashString(text));
      const rows = new Float32Array(raster.height);
      // Streaks come in clusters of rows, which reads as sorted bands rather than noise.
      let current = 0;
      for (let y = 0; y < raster.height; y++) {
        if (y % 6 === 0) current = rand() < 0.45 ? rand() : rand() * 0.15;
        rows[y] = current;
      }
      src.current = { raster, rows, out: new ImageData(raster.width, raster.height) };
      draw(0);
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(node);
    // The pixels carry the text color, so a theme switch needs a fresh raster.
    const theme = new MutationObserver(build);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    document.fonts?.ready.then(build);
    return () => {
      observer.disconnect();
      theme.disconnect();
    };
    // draw reads refs only and is recreated every render; it is not a real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, variant, reduced]);

  useEffect(() => {
    if (on) target.current = 0;
  }, [on]);

  const clock = useRef(0);
  useFrame(
    (_, dt) => {
      clock.current += dt;
      const before = amount.current;
      // Ease toward the target; the rate is set so a full settle takes about `duration`.
      amount.current += (target.current - amount.current) * Math.min(1, dt * (4 / duration));
      if (Math.abs(amount.current - target.current) < 0.002) amount.current = target.current;
      const changed = Math.abs(before - amount.current) > 0.0005 || (variant === "sort" && amount.current > 0.01);
      if (changed) {
        idle.current = false;
        draw(clock.current);
      } else if (!idle.current) {
        idle.current = true;
        draw(clock.current);
      }
    },
    { ref: root, enabled: !reduced },
  );

  return (
    <CanvasText
      text={text}
      as={as}
      className={className}
      style={style}
      rootRef={root}
      canvasRef={canvas}
      fallback={reduced ? text : undefined}
      canvasStyle={{ imageRendering: "auto" }}
    >
      {hover && !reduced && (
        <span
          aria-hidden="true"
          style={{ position: "absolute", inset: 0 }}
          onPointerEnter={() => {
            amount.current = Math.max(amount.current, 0.45);
            target.current = 0;
          }}
        />
      )}
    </CanvasText>
  );
}

export default PixelSort;
