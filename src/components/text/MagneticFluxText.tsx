"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { sampleTextParticles } from "@/lib/text-physics/geometry";
import { clamp, angleDelta } from "@/lib/text-physics/physics";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Needle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  homeAngle: number;
}

interface MagneticFluxTextProps {
  text: string;
  /** Which visual layer to render. */
  layer?: "lines" | "glyphs";
  /** Grid spacing between needles, in px. Smaller = denser field. */
  particleSize?: number;
  /** Radius, in px, within which the cursor aligns nearby needles. */
  interactionRadius?: number;
  fontSize?: number;
}

/**
 * The word is a field of tiny magnetized needles. Each needle carries an
 * orientation, not just a position: near the cursor, needles rotate to
 * align tangent to the field lines circling it (like iron filings around
 * a magnet) and drift along that flow; away from it, they relax back to
 * their resting angle and position.
 */
export default function MagneticFluxText({
  text,
  layer = "lines",
  particleSize = 5,
  interactionRadius = 140,
  fontSize = 140,
}: MagneticFluxTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { points, width, height } = sampleTextParticles(text, {
      fontSize,
      spacing: particleSize,
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";

    const needles: Needle[] = points.map((p) => ({
      homeX: p.x,
      homeY: p.y,
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      homeAngle: 0,
    }));

    const needleLength = particleSize * 1.6;
    const positionStiffness = 90;
    const positionDamping = 14;
    const angleStiffness = 10;
    const angleDamping = 4;

    const setPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current.x = clientX - rect.left;
      pointerRef.current.y = clientY - rect.top;
      pointerRef.current.active = true;
    };

    const handleMove = (event: PointerEvent) => setPointer(event.clientX, event.clientY);
    const handleLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const t = now / 1000;

      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);

      const drawDots = layer === "glyphs";

      for (const needle of needles) {
        let influence = 0;
        let flowX = 0;
        let flowY = 0;

        if (pointer.active) {
          const dx = needle.x - pointer.x;
          const dy = needle.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < interactionRadius) {
            const local = clamp(1 - dist / interactionRadius, 0, 1) ** 1.5;
            if (local > influence) {
              influence = local;
              flowX = -dy / dist;
              flowY = dx / dist;
            }
          }
        }

        const targetX = needle.homeX + flowX * 10 * influence;
        const targetY = needle.homeY + flowY * 10 * influence;

        const ax = (targetX - needle.x) * positionStiffness - needle.vx * positionDamping;
        const ay = (targetY - needle.y) * positionStiffness - needle.vy * positionDamping;
        needle.vx += ax * dt;
        needle.vy += ay * dt;
        needle.x += needle.vx * dt;
        needle.y += needle.vy * dt;

        if (drawDots) {
          const dotRadius = Math.max(particleSize * 0.45, 1.5);
          ctx.fillStyle = "rgba(15, 15, 17, 0.92)";
          ctx.beginPath();
          ctx.arc(needle.x, needle.y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const idleAngle = Math.sin(t * 0.35) * 0.06;
        const fieldAngle = Math.atan2(flowY, flowX);
        const targetAngle =
          influence > 0.02
            ? needle.homeAngle + angleDelta(needle.homeAngle, fieldAngle) * influence
            : needle.homeAngle + idleAngle;

        const delta = angleDelta(needle.angle, targetAngle);
        const angularForce = delta * angleStiffness - needle.angularVelocity * angleDamping;
        needle.angularVelocity += angularForce * dt;
        needle.angle += needle.angularVelocity * dt;

        const glow = 0.75 + influence * 0.25;
        ctx.strokeStyle = `rgba(0, 0, 0, ${glow})`;
        ctx.lineWidth = 1.4;

        const hx = Math.cos(needle.angle) * needleLength * 0.5;
        const hy = Math.sin(needle.angle) * needleLength * 0.5;
        ctx.beginPath();
        ctx.moveTo(needle.x - hx, needle.y - hy);
        ctx.lineTo(needle.x + hx, needle.y + hy);
        ctx.stroke();
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, [text, layer, particleSize, interactionRadius, fontSize, reducedMotion]);

  if (reducedMotion) {
    return (
      <span className="inline-block font-bold" style={{ fontSize }}>
        {text}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block touch-none">
      <canvas ref={canvasRef} />
    </div>
  );
}