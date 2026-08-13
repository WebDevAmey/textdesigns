"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MagneticInkShatterProps {
  text: string;
  className?: string;
}

export default function MagneticInkShatter({
  text,
  className,
}: MagneticInkShatterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const velocityRef = useRef<Record<number, number>>({});
  const lastOffsetRef = useRef<Record<number, { x: number; y: number }>>({});

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      letterRefs.current.forEach((el, i) => {
        if (!el) return;

        const box = el.getBoundingClientRect();
        const lx = box.left + box.width / 2 - rect.left;
        const ly = box.top + box.height / 2 - rect.top;
        const dx = lx - mx;
        const dy = ly - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 90;
        const pull = Math.max(0, 1 - dist / radius);

        const targetX = pull * dx * 0.6;
        const targetY = pull * dy * 0.6;
        const targetRot = pull * (dx > 0 ? 8 : -8);

        // Per-letter velocity drives the chromatic split intensity:
        // fast-moving letters split harder than slow ones, even at the
        // same distance from the cursor.
        const prev = lastOffsetRef.current[i] || { x: 0, y: 0 };
        const vx = targetX - prev.x;
        const vy = targetY - prev.y;
        velocityRef.current[i] = Math.sqrt(vx * vx + vy * vy);
        lastOffsetRef.current[i] = { x: targetX, y: targetY };

        gsap.to(el, {
          x: targetX,
          y: targetY,
          rotate: targetRot,
          scale: 1 + pull * 0.15,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });

        const shadowPx = Math.min(4, velocityRef.current[i] * 0.6 + pull * 2);
        gsap.to(el, {
          textShadow:
            shadowPx > 0.3
              ? `-${shadowPx}px 0 #e24b4a, ${shadowPx}px 0 #378add`
              : "none",
          duration: 0.15,
          overwrite: "auto",
        });
      });
    };

    const handleLeave = () => {
      letterRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          textShadow: "none",
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      });
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [text]);

  // Click a letter to fracture it into four clipped shards that fly
  // apart and fade, then the real letter fades back in underneath.
  const shatterLetter = (index: number) => {
    const el = letterRefs.current[index];
    const parent = containerRef.current;
    if (!el || !parent) return;

    const rect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const computed = getComputedStyle(el);

    const clips = [
      "polygon(0 0, 100% 0, 50% 50%)",
      "polygon(100% 0, 100% 100%, 50% 50%)",
      "polygon(100% 100%, 0 100%, 50% 50%)",
      "polygon(0 100%, 0 0, 50% 50%)",
    ];

    gsap.to(el, { opacity: 0, duration: 0.05 });

    const shards = clips.map((clip) => {
      const shard = document.createElement("span");
      shard.textContent = el.textContent;
      shard.style.position = "absolute";
      shard.style.left = `${rect.left - parentRect.left}px`;
      shard.style.top = `${rect.top - parentRect.top}px`;
      shard.style.fontSize = computed.fontSize;
      shard.style.fontWeight = computed.fontWeight;
      shard.style.color = computed.color;
      shard.style.clipPath = clip;
      shard.style.pointerEvents = "none";
      parent.appendChild(shard);
      return shard;
    });

    shards.forEach((shard, i) => {
      const angle = (i / shards.length) * Math.PI * 2;
      gsap.to(shard, {
        x: Math.cos(angle) * 24,
        y: Math.sin(angle) * 24 - 10,
        rotate: (i % 2 === 0 ? 1 : -1) * 40,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        onComplete: () => shard.remove(),
      });
    });

    gsap.to(el, { opacity: 1, duration: 0.3, delay: 0.35, ease: "power1.in" });
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          onClick={() => shatterLetter(i)}
          style={{
            display: "inline-block",
            willChange: "transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}