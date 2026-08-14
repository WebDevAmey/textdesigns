"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { sampleTextParticles } from "@/lib/text-physics/geometry";
import { createNoiseField } from "@/lib/text-physics/noise";

interface Blob {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  radius: number;
}

interface MoltenMetalTextProps {
  text: string;
  /** Grid spacing between blobs, in px. Smaller = denser, costs more to render. */
  particleSize?: number;
  /** Radius, in px, within which a press-and-drag pulls the metal. */
  interactionRadius?: number;
  fontSize?: number;
}

/**
 * The word is rendered as liquid metal: a field of overlapping soft
 * circles blurred and contrast-boosted (the classic CSS "goo" filter),
 * which makes adjacent blobs visually fuse into one continuous molten
 * body instead of a dotted particle cloud. Hovering near a letter draws
 * a gentle ripple of metal toward the cursor; pressing and dragging
 * grabs it hard and pulls a real ferrofluid-style spike out. Release and
 * surface tension (a low-damping spring) snaps it back, overshooting
 * and wobbling before it resettles. Each blob stretches along its own
 * velocity like a drop of liquid metal in motion.
 */
export default function MoltenMetalText({
  text,
  particleSize = 10,
  interactionRadius = 130,
  fontSize = 140,
}: MoltenMetalTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; down: boolean; active: boolean }>({
    x: -9999,
    y: -9999,
    down: false,
    active: false,
  });

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
    canvas.style.filter = "contrast(38) brightness(1.02)";

    const noise = createNoiseField();

    const blobs: Blob[] = points.map((p) => ({
      homeX: p.x,
      homeY: p.y,
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      seed: Math.random() * 1000,
      radius: particleSize * 0.65,
    }));

    const stiffness = 55;
    const damping = 6.5;
    const hoverPullStrength = 0.35;
    const grabPullStrength = 1;

    const setPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current.x = clientX - rect.left;
      pointerRef.current.y = clientY - rect.top;
      pointerRef.current.active = true;
    };

    const handleMove = (event: PointerEvent) => setPointer(event.clientX, event.clientY);
    const handleDown = (event: PointerEvent) => {
      setPointer(event.clientX, event.clientY);
      pointerRef.current.down = true;
    };
    const handleUp = () => {
      pointerRef.current.down = false;
    };
    const handleLeave = () => {
      pointerRef.current.down = false;
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    container.addEventListener("pointerleave", handleLeave);

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const t = now / 1000;
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#111113";

      for (const blob of blobs) {
        const wanderX = noise(blob.seed, 0, t * 0.2) * 1.2;
        const wanderY = noise(0, blob.seed, t * 0.2) * 1.2;
        let targetX = blob.homeX + wanderX;
        let targetY = blob.homeY + wanderY;

        if (pointer.active) {
          const dx = pointer.x - blob.homeX;
          const dy = pointer.y - blob.homeY;
          const dist = Math.hypot(dx, dy);
          if (dist < interactionRadius) {
            const falloff = (1 - dist / interactionRadius) ** 1.6;
            const pull = falloff * (pointer.down ? grabPullStrength : hoverPullStrength);
            targetX += (pointer.x - targetX) * pull;
            targetY += (pointer.y - targetY) * pull;
          }
        }

        const ax = (targetX - blob.x) * stiffness - blob.vx * damping;
        const ay = (targetY - blob.y) * stiffness - blob.vy * damping;
        blob.vx += ax * dt;
        blob.vy += ay * dt;
        blob.x += blob.vx * dt;
        blob.y += blob.vy * dt;

        const speed = Math.hypot(blob.vx, blob.vy);
        const stretch = Math.min(speed / 260, 1.4);
        const angle = Math.atan2(blob.vy, blob.vx);

        ctx.save();
        ctx.translate(blob.x, blob.y);
        ctx.rotate(angle);
        ctx.scale(1 + stretch, 1 / (1 + stretch * 0.55));
        ctx.beginPath();
        ctx.arc(0, 0, blob.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, [text, particleSize, interactionRadius, fontSize]);

  return (
    <div ref={containerRef} className="relative inline-block touch-none">
      <canvas ref={canvasRef} />
    </div>
  );
}
