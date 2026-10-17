import "server-only";
import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Promise<Highlighter> | null = null;

function get() {
  highlighter ??= createHighlighter({ themes: ["github-light", "github-dark"], langs: ["tsx", "ts", "bash", "json", "css", "md"] });
  return highlighter;
}

export async function highlight(code: string, lang: "tsx" | "ts" | "bash" | "json" | "css" | "md" = "tsx") {
  const h = await get();
  return h.codeToHtml(code.trimEnd(), { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: "light" });
}
