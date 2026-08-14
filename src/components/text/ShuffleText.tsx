"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CHAR_W_EM = 0.6;

const seededRandom = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const permutation = (n: number, rand: () => number): number[] => {
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/**
 * The word starts with its characters in a shuffled order. Characters
 * then swap places two at a time, sorting themselves like bubble sort,
 * until the whole word locks into its correct reading order.
 */
export default function ShuffleText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const order = useMemo(() => {
    const rand = seededRandom(text.length * 7919 + 17);
    let p = permutation(text.length, rand);
    if (p.every((v, i) => v === i) && text.length > 1) {
      p = permutation(text.length, rand);
    }
    return p;
  }, [text]);

  useGSAP(
    () => {
      const chars = charRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      if (chars.length < 2) return;

      const slots = order.slice();
      let timer: number | undefined;
      let disposed = false;

      const step = () => {
        if (disposed) return;
        let a = -1;
        for (let i = 0; i < slots.length - 1; i++) {
          if (slots[i] > slots[i + 1]) {
            a = i;
            break;
          }
        }
        if (a === -1) return;

        const b = a + 1;
        const xa = `${slots[b] * CHAR_W_EM + CHAR_W_EM / 2}em`;
        const xb = `${slots[a] * CHAR_W_EM + CHAR_W_EM / 2}em`;
        [slots[a], slots[b]] = [slots[b], slots[a]];
        gsap.to(chars[a], { left: xa, duration: 0.34, ease: "power2.inOut" });
        gsap.to(chars[b], {
          left: xb,
          duration: 0.34,
          ease: "power2.inOut",
          onComplete: () => {
            if (!disposed) timer = window.setTimeout(step, 60);
          },
        });
      };

      timer = window.setTimeout(step, 500);

      return () => {
        disposed = true;
        if (timer) window.clearTimeout(timer);
      };
    },
    { scope: containerRef }
  );

  const slotLeft = (slot: number) => `${slot * CHAR_W_EM + CHAR_W_EM / 2}em`;

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={{ width: `${text.length * CHAR_W_EM}em` }}
    >
      <span className="sr-only">{text}</span>
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className="absolute top-0"
          style={{ left: slotLeft(order[i]) }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}