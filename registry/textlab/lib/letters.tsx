import type { CSSProperties, ReactNode } from "react";
import { splitWords } from "./split";

/**
 * Render text as words of inline-block letters marked with data-tl-char, keeping words unbreakable.
 * `render` can wrap each letter; it receives the char and its index across the whole text.
 */
export function Letters({ text, charStyle, render, part = false }: { text: string; charStyle?: CSSProperties | ((index: number) => CSSProperties); render?: (char: string, index: number) => ReactNode; /** Mark letters as animated parts, so the no-script and reduced-motion fallbacks can reveal them. */ part?: boolean }) {
  const words = splitWords(text);
  return (
    <>
      {words.map((word, w) => (
        <span key={w}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.chars.map((char, c) => {
              const i = word.charOffset + c;
              return (
                <span key={c} data-tl-char="" data-tl-part={part ? "" : undefined} style={{ display: "inline-block", ...(typeof charStyle === "function" ? charStyle(i) : charStyle) }}>
                  {render ? render(char, i) : char}
                </span>
              );
            })}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
