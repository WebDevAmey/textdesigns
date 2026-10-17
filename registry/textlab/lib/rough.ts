/**
 * Hand-drawn SVG paths in a 100 × 20 box (stretch with preserveAspectRatio="none" and
 * vector-effect="non-scaling-stroke"). Jitter is seeded, so server and client draw the same line.
 */
import { seeded } from "./math";

const f = (n: number) => n.toFixed(2);

export function roughUnderline(seed = 1) {
  const r = seeded(seed);
  const y = 14 + r() * 2;
  return `M ${f(1 + r() * 2)} ${f(y + r() * 1.5)} C ${f(30)} ${f(y - 2 - r() * 2)}, ${f(65)} ${f(y + 2 + r() * 2)}, ${f(98 + r())} ${f(y - 1 + r() * 2)}`;
}

export function roughWave(seed = 1, waves = 6) {
  const r = seeded(seed);
  let d = `M 1 ${f(15 + r())}`;
  const step = 98 / waves;
  for (let i = 0; i < waves; i++) {
    const x = 1 + step * (i + 1);
    const up = i % 2 === 0 ? 11 : 18;
    d += ` Q ${f(x - step / 2)} ${f(up + r() * 1.5)} ${f(x)} ${f(15 + r() * 1.2)}`;
  }
  return d;
}

export function roughScribble(seed = 1) {
  const r = seeded(seed);
  return `M 2 ${f(13 + r())} C 30 ${f(10 + r() * 2)}, 70 ${f(12 + r() * 2)}, 98 ${f(12 + r())} C 70 ${f(16 + r())}, 35 ${f(15 + r() * 2)}, 6 ${f(17 + r())} C 40 ${f(18 + r())}, 75 ${f(17 + r())}, 96 ${f(18 + r())}`;
}

export function roughStrike(seed = 1) {
  const r = seeded(seed);
  return `M ${f(r() * 2)} ${f(10 + r())} C 35 ${f(9 + r())}, 65 ${f(11 + r())}, ${f(99 + r())} ${f(9.5 + r())}`;
}

export function roughStrikeScribble(seed = 1) {
  const r = seeded(seed);
  let d = `M 0 ${f(10 + r())}`;
  for (let i = 1; i <= 7; i++) {
    const x = (i / 7) * 100;
    d += ` L ${f(x - 6 + r() * 2)} ${f(i % 2 ? 5 + r() * 2 : 14 + r() * 2)}`;
  }
  return d;
}

/** An ellipse drawn in one stroke that overshoots its start, like a pen circling a word. */
export function roughEllipse(seed = 1) {
  const r = seeded(seed);
  const cx = 50;
  const cy = 10;
  const rx = 50;
  const ry = 10.5;
  const points: string[] = [];
  const turns = 1.12;
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns - Math.PI * 0.6;
    const wobble = 1 + (r() - 0.5) * 0.04 + (i / steps) * 0.05;
    points.push(`${f(cx + Math.cos(t) * rx * wobble)} ${f(cy + Math.sin(t) * ry * wobble)}`);
  }
  return `M ${points.join(" L ")}`;
}

export function roughBox(seed = 1) {
  const r = seeded(seed);
  const j = () => (r() - 0.5) * 1.6;
  return `M ${f(1 + j())} ${f(1 + j())} L ${f(99 + j())} ${f(0.5 + j())} L ${f(99.5 + j())} ${f(19 + j())} L ${f(0.5 + j())} ${f(19.5 + j())} Z M ${f(2 + j())} ${f(2 + j())} L ${f(30)} ${f(1.2 + j())}`;
}

export function roughBrackets(seed = 1) {
  const r = seeded(seed);
  const j = () => (r() - 0.5) * 1;
  return `M ${f(6 + j())} ${f(1 + j())} L ${f(1 + j())} ${f(1 + j())} L ${f(1 + j())} ${f(19 + j())} L ${f(6 + j())} ${f(19 + j())} M ${f(94 + j())} ${f(1 + j())} L ${f(99 + j())} ${f(1 + j())} L ${f(99 + j())} ${f(19 + j())} L ${f(94 + j())} ${f(19 + j())}`;
}
