"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { CanvasText } from "../lib/canvas-text";
import { hashString, seeded } from "../lib/math";
import { fitCanvas, rasterize } from "../lib/raster";
import { useFrame } from "../lib/use-frame";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type AsciiTextVariant = "classic" | "blocks" | "braille";

export interface AsciiTextProps {
  text: string;
  /** classic uses .:-=+*#%@, blocks uses shade blocks, braille packs 2×4 dots per cell for fine detail. */
  variant?: AsciiTextVariant;
  /** Cell size as a share of the font size. Smaller is finer and costlier. */
  density?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const RAMPS = { classic: " .:-=+*#%@", blocks: " ░▒▓█" };

type Grid = { cols: number; rows: number; cell: number; bleed: number; cover: Float32Array; dots: Uint8Array; order: Float32Array };

/**
 * The title rendered in ASCII glyphs. Move the pointer across it and a ripple runs through the
 * characters; scroll it into view and the glyphs resolve in a scattered order.
 */
export function AsciiText({ text, variant = "classic", density = 0.1, as, reducedMotion = "user", className, style }: AsciiTextProps) {
  const { ref: root, on } = useTrigger<HTMLElement>({ trigger: "inView" });
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const grid = useRef<Grid | null>(null);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const born = useRef<number | null>(null);
  const clock = useRef(0);

  const draw = (time: number) => {
    const c = canvas.current;
    const g = grid.current;
    const node = root.current;
    if (!c || !g || !node) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Number(c.dataset.dpr || 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getComputedStyle(node).color;
    ctx.font = `${g.cell * (variant === "braille" ? 1.15 : 1.25)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const p = pointer.current;
    const px = p.x + g.bleed;
    const py = p.y + g.bleed;
    const reveal = born.current === null ? 0 : Math.min(1, (time - born.current) / 0.9);
    const ramp = variant === "blocks" ? RAMPS.blocks : RAMPS.classic;
    for (let r = 0; r < g.rows; r++) {
      for (let q = 0; q < g.cols; q++) {
        const i = r * g.cols + q;
        let level = g.cover[i];
        if (level < 0.03 || g.order[i] > reveal) continue;
        const x = q * g.cell + g.cell / 2;
        const y = r * g.cell + g.cell / 2;
        if (p.active) {
          const d = Math.hypot(px - x, py - y);
          level += Math.sin(d / (g.cell * 1.6) - time * 9) * Math.exp(-d / (g.cell * 7)) * 0.6;
        }
        if (variant === "braille") {
          let bits = g.dots[i];
          if (p.active && level < g.cover[i] - 0.15) bits &= 0b01010101;
          if (!bits) continue;
          ctx.fillText(String.fromCharCode(0x2800 + bits), x, y);
        } else {
          const k = Math.max(1, Math.min(ramp.length - 1, Math.round(level * (ramp.length - 1))));
          ctx.fillText(ramp[k], x, y);
        }
      }
    }
  };

  useEffect(() => {
    const node = root.current;
    const c = canvas.current;
    if (!node || !c || reduced) return;
    const build = () => {
      const { width, height, dpr } = fitCanvas(c);
      const raster = rasterize(node, text, width, height, { dpr: 1 });
      const font = parseFloat(getComputedStyle(node).fontSize) || 16;
      const cell = Math.max(3, font * density);
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const cover = new Float32Array(cols * rows);
      const dots = new Uint8Array(cols * rows);
      const order = new Float32Array(cols * rows);
      const rand = seeded(hashString(text));
      const alpha = (x: number, y: number) => {
        const xi = Math.min(raster.width - 1, Math.max(0, Math.round(x)));
        const yi = Math.min(raster.height - 1, Math.max(0, Math.round(y)));
        return raster.data[(yi * raster.width + xi) * 4 + 3] / 255;
      };
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const i = r * cols + q;
          let sum = 0;
          let bits = 0;
          // Eight sub-samples per cell: enough for coverage, and exactly the braille dot grid.
          const map = [0, 3, 1, 4, 2, 5, 6, 7];
          for (let sy = 0; sy < 4; sy++) {
            for (let sx = 0; sx < 2; sx++) {
              const a = alpha(q * cell + (sx + 0.5) * (cell / 2), r * cell + (sy + 0.5) * (cell / 4));
              sum += a;
              if (a > 0.45) bits |= 1 << map[sy * 2 + sx];
            }
          }
          cover[i] = sum / 8;
          dots[i] = bits;
          order[i] = rand();
        }
      }
      const bleed = (width - node.getBoundingClientRect().width) / 2;
      grid.current = { cols, rows, cell, bleed, cover, dots, order };
      c.dataset.dpr = String(dpr);
      draw(0);
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(node);
    document.fonts?.ready.then(build);
    return () => observer.disconnect();
    // draw reads refs only and is recreated every render; it is not a real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, variant, density, reduced]);

  useFrame(
    (_, dt) => {
      clock.current += dt;
      if (on && born.current === null) born.current = clock.current;
      const revealing = born.current !== null && clock.current - born.current < 1;
      if (revealing || pointer.current.active) draw(clock.current);
    },
    { ref: root, enabled: !reduced },
  );

  return <CanvasText text={text} as={as} className={className} style={style} rootRef={root} canvasRef={canvas} fallback={reduced ? text : undefined} />;
}

export default AsciiText;
