/**
 * Draw text into an offscreen canvas with the element's own font, for canvas and WebGL effects.
 * Everything is in CSS pixels times `dpr`; dpr is capped at 2 to keep pixel work bounded.
 */
export interface Raster {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** Canvas size in device pixels. */
  width: number;
  height: number;
  dpr: number;
  /** RGBA pixels of the rendered text. */
  data: Uint8ClampedArray;
}

export const cappedDpr = () => Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);

/** The CSS font shorthand for an element, usable by canvas. */
export function canvasFont(el: Element) {
  const cs = getComputedStyle(el);
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
}

/**
 * Render `text` centered into a canvas of the given CSS size. `pad` adds room on each side,
 * as a share of the font size, for effects that spill outside the glyphs.
 */
export function rasterize(el: HTMLElement, text: string, cssWidth: number, cssHeight: number, { color = "#fff", dpr = cappedDpr() } = {}): Raster {
  const canvas = document.createElement("canvas");
  const width = Math.max(1, Math.round(cssWidth * dpr));
  const height = Math.max(1, Math.round(cssHeight * dpr));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const cs = getComputedStyle(el);
  ctx.scale(dpr, dpr);
  ctx.font = canvasFont(el);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx && cs.letterSpacing !== "normal") (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
  ctx.fillText(text, cssWidth / 2, cssHeight / 2 + parseFloat(cs.fontSize) * 0.04);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const data = ctx.getImageData(0, 0, width, height).data;
  return { canvas, ctx, width, height, dpr, data };
}

/** Size a visible canvas to its box in device pixels. Returns the CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement, dpr = cappedDpr()) {
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { width: rect.width, height: rect.height, dpr };
}
