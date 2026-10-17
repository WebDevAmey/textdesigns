"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { CanvasText } from "../lib/canvas-text";
import { hashString, seeded } from "../lib/math";
import { fitCanvas, rasterize } from "../lib/raster";
import { useFrame } from "../lib/use-frame";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type ParticleTextVariant = "dust" | "sand" | "stars";

export interface ParticleTextProps {
  text: string;
  /** dust is fine and quick, sand is heavier and warm, stars twinkle and glow. */
  variant?: ParticleTextVariant;
  /** Sampling gap in px between particles. Smaller means more particles. */
  gap?: number;
  /** Pointer push radius, in em. */
  radius?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

type Swarm = { hx: Float32Array; hy: Float32Array; x: Float32Array; y: Float32Array; vx: Float32Array; vy: Float32Array; tint: Float32Array; count: number; bleed: number; em: number; dpr: number };

/**
 * Particles gather into letters and scatter where you touch. Each particle is sprung to its home
 * in the glyph; the pointer pushes them aside and they flow back when it leaves.
 */
export function ParticleText({ text, variant = "dust", gap = 3, radius = 1.2, as, reducedMotion = "user", className, style }: ParticleTextProps) {
  const { ref: root, on } = useTrigger<HTMLElement>({ trigger: "inView" });
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const swarm = useRef<Swarm | null>(null);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const settled = useRef(false);
  const time = useRef(0);

  useEffect(() => {
    const node = root.current;
    const c = canvas.current;
    if (!node || !c || reduced) return;
    const build = () => {
      const { width, height, dpr } = fitCanvas(c);
      const raster = rasterize(node, text, width, height, { dpr: 1 });
      const rand = seeded(hashString(text));
      const hx: number[] = [];
      const hy: number[] = [];
      const step = Math.max(1.5, gap);
      for (let y = 0; y < raster.height; y += step) {
        for (let x = 0; x < raster.width; x += step) {
          if (raster.data[(Math.round(y) * raster.width + Math.round(x)) * 4 + 3] > 128) {
            hx.push(x + (rand() - 0.5) * step * 0.6);
            hy.push(y + (rand() - 0.5) * step * 0.6);
          }
        }
      }
      const count = Math.min(hx.length, 9000);
      const s: Swarm = {
        hx: Float32Array.from(hx.slice(0, count)),
        hy: Float32Array.from(hy.slice(0, count)),
        x: new Float32Array(count),
        y: new Float32Array(count),
        vx: new Float32Array(count),
        vy: new Float32Array(count),
        tint: new Float32Array(count),
        count,
        bleed: (width - node.getBoundingClientRect().width) / 2,
        em: parseFloat(getComputedStyle(node).fontSize) || 16,
        dpr,
      };
      for (let i = 0; i < count; i++) {
        // Start scattered in a wide cloud; the intro gathers them home.
        const a = rand() * Math.PI * 2;
        const r = (0.4 + rand()) * width * 0.6;
        s.x[i] = width / 2 + Math.cos(a) * r;
        s.y[i] = height / 2 + Math.sin(a) * r * 0.5;
        s.tint[i] = rand();
      }
      swarm.current = s;
      settled.current = false;
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(node);
    document.fonts?.ready.then(build);
    return () => observer.disconnect();
  }, [text, gap, reduced, root]);

  useFrame(
    (_, dt) => {
      const s = swarm.current;
      const c = canvas.current;
      const node = root.current;
      if (!s || !c || !node) return;
      time.current += dt;
      const p = pointer.current;
      if (settled.current && !p.active && variant !== "stars") return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const px = p.x + s.bleed;
      const py = p.y + s.bleed;
      const reach = radius * s.em;
      const heavy = variant === "sand";
      const stiffness = on ? (heavy ? 40 : 70) : 0;
      const damping = heavy ? 7 : 9;
      let energy = 0;
      for (let i = 0; i < s.count; i++) {
        let ax = (s.hx[i] - s.x[i]) * stiffness - s.vx[i] * damping;
        let ay = (s.hy[i] - s.y[i]) * stiffness - s.vy[i] * damping;
        if (p.active) {
          const dx = s.x[i] - px;
          const dy = s.y[i] - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach * reach) {
            const d = Math.sqrt(d2) || 1;
            const push = (1 - d / reach) * (heavy ? 5200 : 8000);
            ax += (dx / d) * push;
            ay += (dy / d) * push + (heavy ? 900 : 0);
          }
        }
        s.vx[i] += ax * dt;
        s.vy[i] += ay * dt;
        s.x[i] += s.vx[i] * dt;
        s.y[i] += s.vy[i] * dt;
        energy += Math.abs(s.vx[i]) + Math.abs(s.vy[i]);
      }
      settled.current = on && energy / s.count < 0.05;

      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      const color = getComputedStyle(node).color;
      ctx.fillStyle = color;
      const size = variant === "dust" ? 1.4 : variant === "sand" ? 1.8 : 1.6;
      if (variant === "stars") {
        for (let i = 0; i < s.count; i++) {
          ctx.globalAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time.current * (1.5 + s.tint[i] * 3) + s.tint[i] * 40));
          ctx.fillRect(s.x[i] - size / 2, s.y[i] - size / 2, size, size);
        }
        ctx.globalAlpha = 1;
      } else if (heavy) {
        for (let i = 0; i < s.count; i++) {
          ctx.globalAlpha = 0.55 + s.tint[i] * 0.45;
          ctx.fillRect(s.x[i], s.y[i], size, size);
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        for (let i = 0; i < s.count; i++) ctx.rect(s.x[i], s.y[i], size, size);
        ctx.fill();
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
      bleed={0.6}
      fallback={reduced ? text : undefined}
      canvasStyle={variant === "stars" ? { filter: "drop-shadow(0 0 2px currentColor)" } : undefined}
    />
  );
}

export default ParticleText;
