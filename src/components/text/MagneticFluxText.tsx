"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { sampleTextParticles } from "@/lib/text-physics/geometry";
import { clamp, angleDelta } from "@/lib/text-physics/physics";

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

interface Pulse {
  x: number;
  y: number;
  start: number;
}

interface MagneticFluxTextProps {
  text: string;
  /** Which visual layer to render. */
  layer?: "lines" | "glyphs" | "pulses";
  /** Grid spacing between needles, in px. Smaller = denser field. */
  particleSize?: number;
  /** Radius, in px, within which the cursor aligns nearby needles. */
  interactionRadius?: number;
  fontSize?: number;
}

const PULSE_LIFETIME_MS = 900;

/**
 * The word is a field of tiny magnetized needles. Each needle carries an
 * orientation, not just a position: near the cursor, needles rotate to
 * align tangent to the field lines circling it (like iron filings around
 * a magnet) and drift along that flow; away from it, they relax back to
 * their resting angle and position. Clicking sends a decaying ring pulse
 * that briefly re-aligns needles as it expands outward.
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
  const pulsesRef = useRef<Pulse[]>([]);

  useEffect(() => {
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
    const spawnPulse = (x: number, y: number) => {
      const pulses = pulsesRef.current;
      pulses.push({ x, y, start: performance.now() });
      if (pulses.length > 6) pulses.shift();
    };

    const handleDown = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      spawnPulse(event.clientX - rect.left, event.clientY - rect.top);
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);
    container.addEventListener("pointerdown", handleDown);

    const autoOrigins: Array<[number, number]> = [
      [0.5, 0.5],
      [0.24, 0.5],
      [0.76, 0.5],
      [0.5, 0.32],
      [0.5, 0.68],
    ];
    let autoIndex = 0;
    const fireAutoPulse = () => {
      const [fx, fy] = autoOrigins[autoIndex % autoOrigins.length];
      autoIndex += 1;
      spawnPulse(fx * width, fy * height);
    };
    const initialAutoPulse = window.setTimeout(fireAutoPulse, 600);
    const autoInterval = window.setInterval(fireAutoPulse, 1600);

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const t = now / 1000;

      const pointer = pointerRef.current;
      const pulses = pulsesRef.current.filter(
        (p) => now - p.start < PULSE_LIFETIME_MS
      );
      pulsesRef.current = pulses;

      ctx.clearRect(0, 0, width, height);

      const drawDots = layer === "glyphs";
      const drawRings = layer === "pulses";

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

        for (const pulse of pulses) {
          const age = (now - pulse.start) / PULSE_LIFETIME_MS;
          const pulseRadius = interactionRadius * 1.6 * age;
          const dx = needle.x - pulse.x;
          const dy = needle.y - pulse.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const ring = 1 - clamp(Math.abs(dist - pulseRadius) / 40, 0, 1);
          const local = ring * (1 - age);
          if (local > influence) {
            influence = local;
            flowX = -dy / dist;
            flowY = dx / dist;
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

        const glow = drawRings ? 0.4 + influence * 0.4 : 0.75 + influence * 0.25;
        ctx.strokeStyle = `rgba(0, 0, 0, ${glow})`;
        ctx.lineWidth = 1.4;

        const hx = Math.cos(needle.angle) * needleLength * 0.5;
        const hy = Math.sin(needle.angle) * needleLength * 0.5;
        ctx.beginPath();
        ctx.moveTo(needle.x - hx, needle.y - hy);
        ctx.lineTo(needle.x + hx, needle.y + hy);
        ctx.stroke();
      }

      if (drawRings) {
        for (const pulse of pulses) {
          const age = (now - pulse.start) / PULSE_LIFETIME_MS;
          ctx.strokeStyle = `rgba(0, 0, 0, ${(1 - age) * 0.85})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, interactionRadius * 1.6 * age, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    gsap.ticker.add(tick);

    return () => {
      window.clearTimeout(initialAutoPulse);
      window.clearInterval(autoInterval);
      gsap.ticker.remove(tick);
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      container.removeEventListener("pointerdown", handleDown);
    };
  }, [text, layer, particleSize, interactionRadius, fontSize]);

  return (
    <div ref={containerRef} className="relative inline-block touch-none">
      <canvas ref={canvasRef} />
    </div>
  );
}
