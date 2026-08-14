export interface TextParticleSample {
  x: number;
  y: number;
  charIndex: number;
}

export interface SampleTextOptions {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  /** Grid spacing, in px, between sampled particles. Smaller = denser. */
  spacing?: number;
  /** Horizontal padding, in px, on each side of the sampled canvas. */
  padding?: number;
}

export interface SampledText {
  points: TextParticleSample[];
  width: number;
  height: number;
}

/**
 * Renders `text` to an offscreen canvas and reads back the pixels that
 * belong to actual glyph ink, on a `spacing`-px grid. This gives real
 * particle "home" positions shaped like the rendered letterforms,
 * without needing font path/outline data.
 */
export function sampleTextParticles(
  text: string,
  options: SampleTextOptions = {}
): SampledText {
  const {
    fontSize = 140,
    fontFamily = "system-ui, sans-serif",
    fontWeight = 800,
    spacing = 5,
    padding = fontSize * 0.35,
  } = options;

  if (typeof document === "undefined" || text.length === 0) {
    return { points: [], width: 0, height: 0 };
  }

  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) return { points: [], width: 0, height: 0 };
  measureCtx.font = font;

  const charWidths: number[] = [];
  let textWidth = 0;
  for (const ch of text) {
    const w = measureCtx.measureText(ch).width;
    charWidths.push(w);
    textWidth += w;
  }

  const width = Math.max(1, Math.ceil(textWidth + padding * 2));
  const height = Math.max(1, Math.ceil(fontSize * 1.5));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { points: [], width, height };

  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";

  const baseline = height * 0.72;
  let cursorX = padding;
  const charRanges: { start: number; end: number }[] = [];
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], cursorX, baseline);
    charRanges.push({ start: cursorX, end: cursorX + charWidths[i] });
    cursorX += charWidths[i];
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: TextParticleSample[] = [];

  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= 128) continue;

      let charIndex = charRanges.findIndex((r) => x >= r.start && x < r.end);
      if (charIndex === -1) {
        charIndex = x < (charRanges[0]?.start ?? 0) ? 0 : charRanges.length - 1;
      }
      points.push({ x, y, charIndex });
    }
  }

  return { points, width, height };
}
