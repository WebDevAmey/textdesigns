/**
 * Split text into words and graphemes without breaking emoji or accented letters.
 */
export type SplitBy = "chars" | "words" | "lines";

export interface SplitWord {
  /** The word without surrounding spaces. */
  text: string;
  /** Graphemes in this word. */
  chars: string[];
  /** Index of this word in the text. */
  index: number;
  /** Index of the first char of this word across the whole text. */
  charOffset: number;
}

let segmenter: Intl.Segmenter | null | undefined;

/** Split a string into user-perceived characters. */
export function graphemes(text: string): string[] {
  if (segmenter === undefined) {
    segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
  }
  if (segmenter) return Array.from(segmenter.segment(text), (s) => s.segment);
  return Array.from(text);
}

/** Split text into words, collapsing runs of whitespace. Newlines are treated as spaces. */
export function splitWords(text: string): SplitWord[] {
  const words: SplitWord[] = [];
  let charOffset = 0;
  for (const part of text.split(/\s+/)) {
    if (!part) continue;
    const chars = graphemes(part);
    words.push({ text: part, chars, index: words.length, charOffset });
    charOffset += chars.length;
  }
  return words;
}

/** Count graphemes, ignoring whitespace. */
export function countChars(text: string): number {
  return splitWords(text).reduce((sum, word) => sum + word.chars.length, 0);
}

/** Split text on explicit newlines, trimming each line and dropping empty ones. */
export function splitExplicitLines(text: string): string[] {
  return text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
