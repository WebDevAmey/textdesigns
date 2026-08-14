"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { createNoiseField } from "@/lib/text-physics/noise";

gsap.registerPlugin(useGSAP);

interface Bead {
  el: HTMLElement;
  dispX: number;
  dispY: number;
  velX: number;
  velY: number;
  seed: number;
}

interface ResonantChainTextProps {
  text: string;
  /** How strongly each character springs back toward zero displacement. */
  tension?: number;
  /** Velocity damping; higher settles faster, lower rings longer. */
  damping?: number;
}

const STRUM_RADIUS = 46;
const STRUM_COOLDOWN_MS = 200;
const HOVER_RADIUS = 70;

/**
 * The word is a taut chain of character-beads coupled to their
 * neighbors, like beads threaded on a tensioned cord — drawn explicitly
 * as a thin thread beneath the text that redraws every frame from each
 * bead's live position.
 *
 * Three ways to play it: grab a character directly and drag it — the
 * rest of the chain follows with spring lag and rings out when you let
 * go, exactly like pulling a real rope. Click in the gaps between
 * letters to pluck the nearest one with a single impulse. Press and
 * drag across the word to strum it, plucking each character in turn as
 * the cursor sweeps past. A slow per-bead noise field keeps a faint
 * idle hum running at rest, and each character's color shifts hotter
 * the faster it's currently moving, so the chain's kinetic energy is
 * visible, not just its position.
 */
export default function ResonantChainText({
  text,
  tension = 46,
  damping = 4.2,
}: ResonantChainTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];
    const noise = createNoiseField();

    const beads: Bead[] = chars.map((el, i) => ({
      el,
      dispX: 0,
      dispY: 0,
      velX: 0,
      velY: 0,
      seed: i * 13.7 + Math.random() * 4,
    }));

    const coupling = 90;
    const pointer = { x: -9999, y: -9999, active: false, down: false };
    let draggedIndex: number | null = null;
    const lastStrum = new Map<number, number>();

    const findClosestBead = (clientX: number) => {
      let closestIndex = 0;
      let closestDist = Infinity;
      let grabRadius = 20;
      beads.forEach((bead, i) => {
        const rect = bead.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = Math.abs(cx - clientX);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
          grabRadius = rect.width / 2 + 6;
        }
      });
      return { index: closestIndex, dist: closestDist, grabRadius };
    };

    const handleMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const handleLeave = () => {
      pointer.active = false;
    };

    const handleDown = (event: PointerEvent) => {
      pointer.down = true;
      const { index, dist, grabRadius } = findClosestBead(event.clientX);
      if (dist < grabRadius) {
        draggedIndex = index;
        return;
      }
      const bead = beads[index];
      const rect = bead.el.getBoundingClientRect();
      const direction = event.clientY < rect.top + rect.height / 2 ? -1 : 1;
      bead.velY += 380 * direction;
    };

    const handleUp = () => {
      pointer.down = false;
      draggedIndex = null;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerup", handleUp);
    textEl.addEventListener("pointerdown", handleDown);

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const t = now / 1000;

      if (pointer.active) {
        for (let i = 0; i < beads.length; i++) {
          if (i === draggedIndex) continue;
          const bead = beads[i];
          const rect = bead.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(pointer.x - cx, pointer.y - cy);

          if (pointer.down && draggedIndex === null && dist < STRUM_RADIUS) {
            const last = lastStrum.get(i) ?? 0;
            if (now - last > STRUM_COOLDOWN_MS) {
              lastStrum.set(i, now);
              bead.velY += (cy > pointer.y ? 1 : -1) * 260;
              bead.velX += (Math.random() - 0.5) * 60;
            }
          } else if (!pointer.down && dist < HOVER_RADIUS) {
            const push = (1 - dist / HOVER_RADIUS) * 6;
            bead.velY += push * (cy > pointer.y ? 1 : -1) * dt * 40;
          }
        }
      }

      if (draggedIndex !== null) {
        const bead = beads[draggedIndex];
        const rect = bead.el.getBoundingClientRect();
        const restCx = rect.left + rect.width / 2 - bead.dispX;
        const restCy = rect.top + rect.height / 2 - bead.dispY;
        const targetDispX = pointer.x - restCx;
        const targetDispY = pointer.y - restCy;
        bead.velX += (targetDispX - bead.dispX) * 60 * dt;
        bead.velY += (targetDispY - bead.dispY) * 60 * dt;
      }

      for (let i = 0; i < beads.length; i++) {
        const bead = beads[i];
        const left = beads[i - 1];
        const right = beads[i + 1];

        let couplingX = 0;
        let couplingY = 0;
        if (left) {
          couplingX += (left.dispX - bead.dispX) * coupling;
          couplingY += (left.dispY - bead.dispY) * coupling;
        }
        if (right) {
          couplingX += (right.dispX - bead.dispX) * coupling;
          couplingY += (right.dispY - bead.dispY) * coupling;
        }

        const hum = noise(bead.seed, 0, t * 0.35) * 0.6;
        const isDragged = i === draggedIndex;
        const restPull = isDragged ? 0 : tension;

        const forceX = couplingX - bead.dispX * restPull - bead.velX * damping;
        const forceY = couplingY - bead.dispY * restPull - bead.velY * damping + hum;

        bead.velX += forceX * dt;
        bead.velY += forceY * dt;
        bead.dispX += bead.velX * dt;
        bead.dispY += bead.velY * dt;

        const speed = Math.hypot(bead.velX, bead.velY);
        const energy = Math.min(speed / 140, 1);

        gsap.set(bead.el, {
          x: bead.dispX,
          y: bead.dispY,
          rotation: bead.dispY * 0.18 + bead.dispX * 0.05,
          color:
            energy > 0.04
              ? `hsl(${248 - energy * 40}, ${40 + energy * 45}%, ${22 + energy * 28}%)`
              : "currentColor",
        });
      }

      const svgPath = svgPathRef.current;
      if (svgPath) {
        const containerRect = container.getBoundingClientRect();
        let d = "";
        beads.forEach((bead, i) => {
          const rect = bead.el.getBoundingClientRect();
          const x = rect.left + rect.width / 2 - containerRect.left;
          const y = rect.bottom - containerRect.top + 6;
          d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
        });
        svgPath.setAttribute("d", d);
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerup", handleUp);
      textEl.removeEventListener("pointerdown", handleDown);
      split.revert();
    };
  }, [text, tension, damping]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path ref={svgPathRef} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
      </svg>
      <h1 ref={textRef} className="inline-block cursor-grab touch-none select-none">
        {text}
      </h1>
    </div>
  );
}
