"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, PictureInPicture2, SquareTerminal } from "lucide-react";
import DocsNav from "@/components/animations/DocsNav";
import DocsFooter from "@/components/animations/DocsFooter";
import DocsSidebar from "@/components/animations/DocsSidebar";
import type { DocGroup } from "@/lib/animations-docs";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|const|let|var|function|return|interface|type|extends|if|else|for|while|switch|case|new|typeof|as|async|await|in|of)\b/g;

function highlightTsx(code: string): string {
  const parts: string[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code))) {
    parts.push(escapeHtml(code.slice(last, m.index)));
    if (m[1]) {
      parts.push(`<span class="text-neutral-400 italic">${escapeHtml(m[1])}</span>`);
    } else if (m[2]) {
      parts.push(`<span class="text-neutral-600">${escapeHtml(m[2])}</span>`);
    } else {
      parts.push(`<span class="font-medium text-neutral-900">${m[0]}</span>`);
    }
    last = m.index + m[0].length;
  }
  parts.push(escapeHtml(code.slice(last)));
  return parts.join("");
}

interface AnimationDocsProps {
  groups: DocGroup[];
}

export default function AnimationDocs({ groups }: AnimationDocsProps) {
  const docs = groups.flatMap((g) => g.docs);
  const [activeSlug, setActiveSlug] = useState(docs[0].slug);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [previewIteration, setPreviewIteration] = useState(0);

  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (docs.some((d) => d.slug === hash)) setActiveSlug(hash);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [docs]);

  const active = docs.find((d) => d.slug === activeSlug) ?? docs[0];

  useEffect(() => {
    if (view !== "preview" || !active.replays) return;
    const timer = window.setTimeout(
      () => setPreviewIteration((i) => i + 1),
      4500
    );
    return () => window.clearTimeout(timer);
  }, [view, active.slug, active.replays, previewIteration]);

  const copySource = async () => {
    if (!active.source) return;
    try {
      await navigator.clipboard.writeText(active.source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DocsNav groups={groups} onSelect={setActiveSlug} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-10 px-4 py-10 md:px-8">
        <DocsSidebar
          groups={groups}
          activeSlug={active.slug}
          onSelect={setActiveSlug}
          className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto lg:block"
        />

        <article className="min-w-0 max-w-3xl flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {active.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {active.description}
          </p>

          <div className="mt-10 flex flex-col gap-8">
            <section>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-0 inline-flex h-10 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-500">
                  <button
                    type="button"
                    onClick={() => setView("preview")}
                    className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 gap-2 px-3 py-1.5 text-sm h-8 font-medium ${
                      view === "preview"
                        ? "text-neutral-900"
                        : "hover:text-neutral-700"
                    }`}
                  >
                    {view === "preview" && (
                      <motion.span
                        layoutId="docs-tab-pill"
                        className="absolute inset-0 rounded-md bg-white shadow-sm"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <PictureInPicture2 className="h-4 w-4" />
                      Preview
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("code")}
                    className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 gap-2 px-3 py-1.5 text-sm h-8 font-medium ${
                      view === "code"
                        ? "text-neutral-900"
                        : "hover:text-neutral-700"
                    }`}
                  >
                    {view === "code" && (
                      <motion.span
                        layoutId="docs-tab-pill"
                        className="absolute inset-0 rounded-md bg-white shadow-sm"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <SquareTerminal className="h-4 w-4" />
                      Code
                    </span>
                  </button>
                </div>
                {view === "code" && active.source && (
                  <button
                    type="button"
                    onClick={copySource}
                    aria-label="Copy code"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {view === "preview" ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="relative mt-3 flex h-[480px] w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
                      <span className="absolute left-3 top-3 z-10 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Interactive Preview
                      </span>
                      {active.interactions.length > 0 && (
                        <div className="absolute bottom-3 right-3 z-10 flex gap-1">
                          {active.interactions.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm border border-border bg-background px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex max-w-full items-center justify-center px-6 text-foreground">
                        {active.component ? (
                          <div className="scale-150">
                            <active.component
                              key={`${active.slug}-${previewIteration}`}
                              text={active.previewText}
                              {...active.previewProps}
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                            Under Construction
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  active.source && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                        <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-1.5">
                          <span className="font-mono text-xs text-muted-foreground">
                            {active.name.replace(/\s+/g, "-").toLowerCase()}.tsx
                          </span>
                        </div>
                        <pre className="max-h-96 overflow-auto p-4 font-mono text-sm leading-relaxed">
                          <code
                            className="text-[13px] leading-relaxed text-neutral-500"
                            dangerouslySetInnerHTML={{ __html: highlightTsx(active.source) }}
                          />
                        </pre>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Props
              </h2>
              {active.props.length > 0 ? (
                <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Prop</th>
                        <th className="px-3 py-2 font-medium">Type</th>
                        <th className="px-3 py-2 font-medium">Default</th>
                        <th className="px-3 py-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.props.map((p) => (
                        <tr key={p.prop} className="border-b border-border/60 last:border-b-0">
                          <td className="px-3 py-2 font-mono text-xs text-foreground">
                            {p.prop}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {p.type}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {p.default}
                          </td>
                          <td className="px-3 py-2 text-sm text-muted-foreground">
                            {p.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">None yet.</p>
              )}
            </section>
          </div>
        </article>
      </main>

      <DocsFooter />
    </div>
  );
}