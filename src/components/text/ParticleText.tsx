"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { sampleTextParticles } from "@/lib/text-physics/geometry";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  delay: number;
  elapsed: number;
}

interface ParticleTextProps {
  text: string;
  /** Grid spacing between particles, in px. Smaller = denser, costs more to render. */
  particleSize?: number;
  fontSize?: number;
  /** px radius within which the cursor nudges settled particles aside. */
  hoverRadius?: number;
  color?: string;
}

const MARGIN = 120;
const STIFFNESS = 60;
const DAMPING = 8;

/**
 * A cloud of particles starts scattered around the text and converges
 * onto positions sampled from the actual glyph shapes, each particle
 * given a random start delay and fade-in so the assembly reads as a
 * loose flock arriving rather than a single uniform tween. Once
 * settled, the same spring that pulled each particle home keeps
 * running at rest, so hovering nearby nudges particles out of the way
 * and they spring back the moment the cursor moves off.
 */
export default function ParticleText({
  text,
  particleSize = 6,
  fontSize = 120,
  hoverRadius = 90,
  color = "#111113",
}: ParticleTextProps) {
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

    const canvasWidth = width + MARGIN * 2;
    const canvasHeight = height + MARGIN * 2;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    const radius = particleSize * 0.35;

    const particles: Particle[] = points.map((p) => {
      const homeX = p.x + MARGIN;
      const homeY = p.y + MARGIN;
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * (MARGIN * 0.9);
      return {
        homeX,
        homeY,
        x: homeX + Math.cos(angle) * dist,
        y: homeY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        alpha: 0,
        delay: Math.random() * 0.5,
        elapsed: 0,
      };
    });

    const setPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current.x = clientX - rect.left - MARGIN;
      pointerRef.current.y = clientY - rect.top - MARGIN;
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
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = color;

      for (const particle of particles) {
        particle.elapsed += dt;
        if (particle.elapsed < particle.delay) continue;

        let targetX = particle.homeX;
        let targetY = particle.homeY;

        if (pointer.active) {
          const dx = pointer.x - particle.homeX;
          const dy = pointer.y - particle.homeY;
          const dist = Math.hypot(dx, dy);
          if (dist < hoverRadius) {
            const falloff = (1 - dist / hoverRadius) ** 2;
            targetX -= dx * falloff * 0.6;
            targetY -= dy * falloff * 0.6;
          }
        }

        const ax = (targetX - particle.x) * STIFFNESS - particle.vx * DAMPING;
        const ay = (targetY - particle.y) * STIFFNESS - particle.vy * DAMPING;
        particle.vx += ax * dt;
        particle.vy += ay * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        particle.alpha = Math.min(1, particle.alpha + dt * 6);

        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, [text, particleSize, fontSize, hoverRadius, color, reducedMotion]);

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
