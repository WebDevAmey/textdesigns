import type { ReactNode } from "react";
import { highlight } from "./highlight";
import { CodeView } from "./code-view";

export function DocPage({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <article className="max-w-[720px]">
      <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">{title}</h1>
      <p className="mt-3 text-lg text-secondary">{lead}</p>
      <div className="prose-docs mt-8">{children}</div>
    </article>
  );
}

/** Server-highlighted code with a copy button. */
export async function Code({ code, lang = "tsx", label }: { code: string; lang?: "tsx" | "ts" | "bash" | "json" | "css"; label?: string }) {
  const html = await highlight(code, lang);
  return (
    <div className="not-prose my-5">
      <CodeView files={[{ label: label ?? (lang === "bash" ? "Terminal" : lang), raw: code, html }]} />
    </div>
  );
}
