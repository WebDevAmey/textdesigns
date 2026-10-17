import type { CSSProperties, ElementType, ReactNode, Ref } from "react";
import { srOnly } from "./a11y";

export interface CanvasTextProps {
  text: string;
  as?: ElementType;
  /** Room around the text for effects that spill outside the glyphs, in em. */
  bleed?: number;
  className?: string;
  style?: CSSProperties;
  rootRef?: Ref<HTMLElement>;
  canvasRef?: Ref<HTMLCanvasElement>;
  canvasStyle?: CSSProperties;
  /** Shown instead of the canvas, for example under reduced motion or before the effect loads. */
  fallback?: ReactNode;
  children?: ReactNode;
}

/**
 * Layout for canvas effects: an invisible copy of the text sizes the box, and the canvas covers it
 * with `bleed` em of room on every side. Screen readers read the hidden copy.
 */
export function CanvasText({ text, as: Tag = "span", bleed = 0.3, className, style, rootRef, canvasRef, canvasStyle, fallback, children }: CanvasTextProps) {
  return (
    <Tag ref={rootRef} className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ visibility: fallback ? "visible" : "hidden", whiteSpace: "pre" }}>
        {fallback ?? text}
      </span>
      {!fallback && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: "absolute", left: `-${bleed}em`, top: `-${bleed}em`, width: `calc(100% + ${bleed * 2}em)`, height: `calc(100% + ${bleed * 2}em)`, ...canvasStyle }}
        />
      )}
      {children}
    </Tag>
  );
}
