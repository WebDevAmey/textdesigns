"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocGroup } from "@/lib/animations-docs";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8" />
  </svg>
);

const navigationMenuItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Experiments", href: "/experiments", icon: FlaskConical },
  { title: "GitHub", href: "https://github.com/WebDevAmey/textdesigns", icon: GithubIcon, external: true },
];

interface DocsNavProps {
  groups: DocGroup[];
  onSelect: (slug: string) => void;
}

export default function DocsNav({ groups, onSelect }: DocsNavProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      setQuery("");
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return groups
      .flatMap((group) =>
        group.docs
          .filter((d) => `${d.name} ${d.slug}`.toLowerCase().includes(q))
          .map((d) => ({ doc: d, group: group.label }))
      )
      .slice(0, 8);
  }, [groups, query]);

  const select = (slug: string) => {
    onSelect(slug);
    window.location.hash = slug;
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
        <div className="justify-self-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
              T
            </span>
            <span className="hidden text-base font-bold tracking-tight text-foreground sm:inline">
              TextLab
            </span>
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navigationMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className={cn(
                  "group relative inline-flex h-9 w-max items-center justify-center gap-2.5 px-0.5 py-2 text-sm font-medium",
                  "before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:bg-primary before:transition-transform",
                  "hover:before:scale-x-100 focus-visible:before:scale-x-100",
                  isActive
                    ? "text-foreground before:scale-x-100"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:flex"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search</span>
            <kbd className="ml-2 border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/10 px-4 pt-24 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && results[0] && select(results[0].doc.slug)}
                  placeholder="Search animations…"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <kbd className="border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  esc
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {query.trim() === "" ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Type to search animations
                  </p>
                ) : results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No results for “{query}”
                  </p>
                ) : (
                  results.map(({ doc, group }) => (
                    <button
                      key={doc.slug}
                      type="button"
                      onClick={() => select(doc.slug)}
                      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      <span className="font-medium text-foreground">{doc.name}</span>
                      <span className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                        {group}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
