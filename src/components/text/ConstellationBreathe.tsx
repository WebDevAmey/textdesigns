"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ConstellationBreatheProps {
  text: string;
  className?: string;
}

export default function ConstellationBreathe({
  text,
  className,
}: ConstellationBreatheProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const breathingRef = useRef<gsap.core.Tween[]>([]);

  const drawConstellation = () => {
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const rect = container.getBoundingClientRect();
    svg.innerHTML = "";

    for (let i = 0; i < letters.length - 1; i++) {
      const a = letters[i].getBoundingClientRect();
      const b = letters[i + 1].getBoundingClientRect();
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", String(a.left + a.width / 2 - rect.left));
      line.setAttribute("y1", String(a.top + a.height / 2 - rect.top));
      line.setAttribute("x2", String(b.left + b.width / 2 - rect.left));
      line.setAttribute("y2", String(b.top + b.height / 2 - rect.top));
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "1");
      line.style.opacity = "0";
      svg.appendChild(line);
      gsap.to(line, { opacity: 0.5, duration: 0.2, delay: i * 0.05 });
      gsap.to(line, { opacity: 0, duration: 0.6, delay: i * 0.05 + 0.8 });
    }
  };

  // Idle weight-breathing. Tweens a plain JS number because gsap cannot
  // interpolate inside fontVariationSettings directly — onUpdate writes
  // the computed value each tick.
  const startBreathing = () => {
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const tweens = letters.map((el, i) => {
      const state = { wght: 400 };
      return gsap.to(state, {
        wght: 650,
        duration: 1.6,
        delay: i * 0.12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: () => {
          el.style.fontVariationSettings = `"wght" ${state.wght}`;
        },
      });
    });
    breathingRef.current = tweens;
  };

  useGSAP(() => {
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!letters.length) return;

    const tl = gsap.timeline({
      onComplete: () => {
        drawConstellation();
        startBreathing();
      },
    });

    tl.fromTo(
      letters,
      {
        opacity: 0,
        x: () => gsap.utils.random(-40, 40),
        y: () => gsap.utils.random(-30, 30),
        rotate: () => gsap.utils.random(-25, 25),
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.6)",
        stagger: 0.09,
      }
    );

    return () => {
      tl.kill();
      breathingRef.current.forEach((tween) => tween.kill());
    };
  }, [text]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    letterRefs.current.forEach((el) => {
      if (!el) return;

      const box = el.getBoundingClientRect();
      const lx = box.left + box.width / 2 - rect.left;
      const ly = box.top + box.height / 2 - rect.top;
      const dist = Math.hypot(lx - mx, ly - my);
      const pull = Math.max(0, 1 - dist / 70);

      gsap.to(el, {
        scaleY: 1 + pull * 0.35,
        scaleX: 1 - pull * 0.1,
        y: -pull * 6,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  const handleLeave = () => {
    letterRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        scaleY: 1,
        scaleX: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      />
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          style={{ display: "inline-block", transformOrigin: "50% 100%" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}