"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { CanvasText } from "../lib/canvas-text";
import { fitCanvas, rasterize } from "../lib/raster";
import { useFrame } from "../lib/use-frame";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type DitherTextVariant = "dither" | "halftone";

export interface DitherTextProps {
  text: string;
  /** dither uses an ordered Bayer pattern of square pixels, halftone uses dots on an angled screen. */
  variant?: DitherTextVariant;
  /** Pixel or dot pitch as a share of the font size. */
  pitch?: number;
  /** How far the shading falls from top to bottom of the letters, 0 to 1. */
  shade?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/**
 * Ordered dither and halftone dots form the type, shaded top to bottom like a print. It dithers in
 * as it enters the viewport, and the pointer lifts a soft spot of extra ink.
 */
export function DitherText({ text, variant = "dither", pitch = 0.035, shade = 0.55, as, reducedMotion = "user", className, style }: DitherTextProps) {
  const { ref: root, on } = useTrigger<HTMLElement>({ trigger: "inView" });
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const field = useRef<{ cols: number; rows: number; cell: number; bleed: number; value: Float32Array; dpr: number } | null>(null);
  const clock = useRef(0);
  const born = useRef<number | null>(null);
  const last = useRef({ x: -1, y: -1 });

  const draw = (time: number) => {
    const c = canvas.current;
    const f = field.current;
    const node = root.current;
    if (!c || !f || !node) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getComputedStyle(node).color;
    const reveal = born.current === null ? 0 : Math.min(1, (time - born.current) / 1.1);
    const p = pointer.current;
    const px = p.x + f.bleed;
    const py = p.y + f.bleed;
    const spot = f.cell * 22;
    ctx.beginPath();
    for (let r = 0; r < f.rows; r++) {
      for (let q = 0; q < f.cols; q++) {
        let v = f.value[r * f.cols + q];
        if (v <= 0.01) continue;
        const x = q * f.cell;
        const y = r * f.cell;
        if (p.active) v = Math.min(1, v + Math.max(0, 1 - Math.hypot(px - x, py - y) / spot) * 0.5);
        v *= reveal;
        if (variant === "halftone") {
          const radius = Math.sqrt(v) * f.cell * 0.72;
          if (radius < 0.3) continue;
          // Every other row shifts half a cell, which reads as a classic angled screen.
          const ox = r % 2 ? f.cell / 2 : 0;
          ctx.moveTo(x + ox + f.cell / 2 + radius, y + f.cell / 2);
          ctx.arc(x + ox + f.cell / 2, y + f.cell / 2, radius, 0, Math.PI * 2);
        } else if (v > BAYER[(r % 4) * 4 + (q % 4)]) {
          ctx.rect(x, y, f.cell, f.cell);
        }
      }
    }
    ctx.fill();
  };

  useEffect(() => {
    const node = root.current;
    const c = canvas.current;
    if (!node || !c || reduced) return;
    const build = () => {
      const { width, height, dpr } = fitCanvas(c);
      const raster = rasterize(node, text, width, height, { dpr: 1 });
      const font = parseFloat(getComputedStyle(node).fontSize) || 16;
      const cell = Math.max(2, font * pitch);
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const value = new Float32Array(cols * rows);
      // Shade relative to the glyph band, not the whole canvas.
      let top = rows;
      let bottom = 0;
      const alphaAt = (q: number, r: number) => {
        const x = Math.min(raster.width - 1, Math.round(q * cell + cell / 2));
        const y = Math.min(raster.height - 1, Math.round(r * cell + cell / 2));
        return raster.data[(y * raster.width + x) * 4 + 3] / 255;
      };
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) if (alphaAt(q, r) > 0.1) { top = Math.min(top, r); bottom = Math.max(bottom, r); }
      for (let r = 0; r < rows; r++) {
        const t = bottom > top ? (r - top) / (bottom - top) : 0;
        for (let q = 0; q < cols; q++) value[r * cols + q] = alphaAt(q, r) * (1 - t * shade);
      }
      field.current = { cols, rows, cell, bleed: (width - node.getBoundingClientRect().width) / 2, value, dpr };
      draw(clock.current);
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(node);
    document.fonts?.ready.then(build);
    return () => observer.disconnect();
    // draw reads refs only and is recreated every render; it is not a real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, variant, pitch, shade, reduced]);

  useFrame(
    (_, dt) => {
      clock.current += dt;
      if (on && born.current === null) born.current = clock.current;
      const revealing = born.current !== null && clock.current - born.current < 1.2;
      const p = pointer.current;
      const moved = p.active && (p.x !== last.current.x || p.y !== last.current.y);
      last.current = { x: p.x, y: p.y };
      if (revealing || moved) draw(clock.current);
    },
    { ref: root, enabled: !reduced },
  );

  return <CanvasText text={text} as={as} className={className} style={style} rootRef={root} canvasRef={canvas} fallback={reduced ? text : undefined} />;
}

export default DitherText;
