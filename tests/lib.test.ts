import { describe, expect, it } from "vitest";
import { graphemes, splitWords, countChars, splitExplicitLines } from "@registry/textlab/lib/split";
import { clamp, lerp, mapRange, seeded, hashString } from "@registry/textlab/lib/math";
import { resolveEase, cssEase, ease } from "@registry/textlab/lib/motion-tokens";
import { noise2 } from "@registry/textlab/lib/noise";
import { groupByLine } from "@registry/textlab/lib/use-split-lines";

describe("split", () => {
  it("keeps emoji and accents whole", () => {
    expect(graphemes("café 👩‍💻")).toEqual(["c", "a", "f", "é", " ", "👩‍💻"]);
  });

  it("splits words and tracks char offsets", () => {
    const words = splitWords("  Make  every\nword count ");
    expect(words.map((w) => w.text)).toEqual(["Make", "every", "word", "count"]);
    expect(words.map((w) => w.charOffset)).toEqual([0, 4, 9, 13]);
    expect(countChars("Make every")).toBe(9);
  });

  it("splits explicit lines", () => {
    expect(splitExplicitLines("one\n\n two \nthree")).toEqual(["one", "two", "three"]);
  });
});

describe("math", () => {
  it("clamps, lerps and maps", () => {
    expect(clamp(2)).toBe(1);
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    expect(mapRange(50, 0, 10, 0, 100)).toBe(100);
  });

  it("seeded random is deterministic", () => {
    const a = seeded(hashString("textlab"));
    const b = seeded(hashString("textlab"));
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("noise stays in range", () => {
    for (let i = 0; i < 50; i++) {
      const n = noise2(i * 0.37, i * 0.11);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(1);
    }
  });
});

describe("motion tokens", () => {
  it("resolves names and custom curves", () => {
    expect(resolveEase("enter")).toEqual([...ease.enter]);
    expect(resolveEase([0, 0, 1, 1])).toEqual([0, 0, 1, 1]);
    expect(resolveEase(undefined, "exit")).toEqual([...ease.exit]);
    expect(cssEase("linear")).toBe("cubic-bezier(0, 0, 1, 1)");
  });
});

describe("groupByLine", () => {
  it("groups items by line index", () => {
    expect(groupByLine(["a", "b", "c", "d"], [0, 0, 1, 2])).toEqual([["a", "b"], ["c"], ["d"]]);
  });
});
