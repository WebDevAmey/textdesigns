"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { CanvasText } from "../lib/canvas-text";
import { damp } from "../lib/math";
import { fitCanvas, rasterize } from "../lib/raster";
import { useFrame } from "../lib/use-frame";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";
import type { TextShader } from "../lib/webgl";

export type ShaderRippleVariant = "ripple" | "lens";

export interface ShaderRippleProps {
  text: string;
  /** ripple sends rings through the letters from the pointer; lens magnifies a circle under it. */
  variant?: ShaderRippleVariant;
  /** Effect strength, 0 to 2. */
  strength?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * A WebGL ripple bends the title under the pointer. The shader loads only when the title scrolls
 * into view; until then, and wherever WebGL is unavailable, the plain text is shown.
 */
export function ShaderRipple({ text, variant = "ripple", strength = 1, as, reducedMotion = "user", className, style }: ShaderRippleProps) {
  const { ref: root, on } = useTrigger<HTMLElement>({ trigger: "inView", amount: 0.1 });
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const shader = useRef<TextShader | null>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const state = useRef({ hover: 0, mx: 0.5, my: 0.5, time: 0, bleed: 0, width: 1, height: 1 });

  useEffect(() => {
    if (!on || reduced) return;
    let disposed = false;
    let observer: ResizeObserver | null = null;
    import("./gl").then(({ createRipple }) => {
      const node = root.current;
      const c = canvas.current;
      if (disposed || !node || !c) return;
      const s = createRipple(c);
      if (!s) return;
      shader.current = s;
      const build = () => {
        const { width, height, dpr } = fitCanvas(c);
        const raster = rasterize(node, text, width, height, { dpr, color: getComputedStyle(node).color });
        s.resize(c.width, c.height);
        s.setTexture(raster.canvas);
        state.current.bleed = (width - node.getBoundingClientRect().width) / 2;
        state.current.width = width;
        state.current.height = height;
        s.uniform("u_aspect", width / height);
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
      const st = state.current;
      const p = pointer.current;
      st.time += dt;
      st.hover = damp(st.hover, p.active && p.inside ? 1 : 0, 6, dt);
      if (p.active) {
        st.mx = damp(st.mx, (p.x + st.bleed) / st.width, 14, dt);
        st.my = damp(st.my, (p.y + st.bleed) / st.height, 14, dt);
      }
      if (st.hover < 0.001) return;
      s.uniform("u_mouse", st.mx, st.my);
      s.uniform("u_time", st.time);
      s.uniform("u_hover", st.hover);
      s.uniform("u_mode", variant === "lens" ? 1 : 0);
      s.uniform("u_strength", strength);
      s.draw();
    },
    { ref: root, enabled: ready },
  );

  // Draw one still frame as soon as the shader is ready, before any hover.
  useEffect(() => {
    if (!ready || !shader.current) return;
    shader.current.uniform("u_hover", 0);
    shader.current.draw();
  }, [ready]);

  return (
    <CanvasText
      text={text}
      as={as}
      className={className}
      style={style}
      rootRef={root}
      canvasRef={canvas}
      bleed={0.4}
      fallback={reduced ? text : undefined}
      canvasStyle={{ opacity: ready ? 1 : 0 }}
    >
      {!ready && !reduced && (
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, whiteSpace: "pre" }}>
          {text}
        </span>
      )}
    </CanvasText>
  );
}

export default ShaderRipple;
