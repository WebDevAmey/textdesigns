import { useEffect, useState } from "react";
import { graphemes } from "./split";
import { hashString, seeded } from "./math";

export const charsets = {
  random: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  symbols: "!<>-_\\/[]{}=+*^?#%&@~",
  binary: "01",
  katakana: "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜ0123456789",
} as const;

export type ScrambleMode = "sweep" | "all";

export interface ScrambleOptions {
  /** Play forward to the real text while true; show `idle` while false. */
  active: boolean;
  /** Seconds from fully scrambled to settled. */
  duration?: number;
  /** Seconds before it starts. */
  delay?: number;
  charset?: string;
  /** sweep settles letters left to right; all keeps every letter scrambled until the end, then settles fast. */
  mode?: ScrambleMode;
  /** What to show while inactive: the real text or a scrambled frame. */
  idle?: "text" | "scrambled";
  /** Milliseconds between glyph changes; lower is busier. */
  tick?: number;
  onDone?: () => void;
}

/** A deterministic scrambled frame, so the server and the first client render agree. */
export function scrambledFrame(text: string, charset: string, seed = hashString(text)) {
  const rand = seeded(seed);
  return graphemes(text)
    .map((ch) => (/\s/.test(ch) ? ch : charset[Math.floor(rand() * charset.length)]))
    .join("");
}

/**
 * Drive a scramble from noise to `text`. Returns the string to render for this frame.
 * Whitespace never scrambles, so word shapes stay recognisable.
 */
export function useScramble(text: string, { active, duration = 1, delay = 0, charset = charsets.random, mode = "sweep", idle = "scrambled", tick = 45, onDone }: ScrambleOptions) {
  const [frame, setFrame] = useState<string | null>(null);
  const [doneFor, setDoneFor] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const chars = graphemes(text);
    const start = performance.now() + delay * 1000;
    let last = 0;
    let raf = 0;
    const loop = (now: number) => {
      const t = (now - start) / (duration * 1000);
      if (t < 0) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (t >= 1) {
        setFrame(null);
        setDoneFor(text);
        onDone?.();
        return;
      }
      if (now - last >= tick) {
        last = now;
        const settled = mode === "sweep" ? Math.floor(t * chars.length * 1.15 - chars.length * 0.15) : t > 0.8 ? Math.floor(((t - 0.8) / 0.2) * chars.length) : -1;
        setFrame(chars.map((ch, i) => (i <= settled || /\s/.test(ch) ? ch : charset[Math.floor(Math.random() * charset.length)])).join(""));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      setFrame(null);
      setDoneFor(null);
    };
    // onDone is a callback; its identity should not restart the scramble.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, text, duration, delay, charset, mode, tick]);

  if (frame !== null) return frame;
  if (active) return doneFor === text || idle === "text" ? text : scrambledFrame(text, charset);
  return idle === "scrambled" ? scrambledFrame(text, charset) : text;
}
