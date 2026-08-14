"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DocsNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
              T
            </span>
            <span className="hidden text-base font-bold tracking-tight text-foreground sm:inline">
              TextLab
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground sm:flex">
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
          </div>

          <Link
            href="/animations"
            className="hidden h-8 items-center px-3 text-sm text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground sm:flex"
          >
            Animations
          </Link>

          <Link
            href="/experiments"
            className="hidden h-8 items-center px-3 text-sm text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground sm:flex"
          >
            Experiments
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="https://github.com/WebDevAmey/textdesigns"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 items-center gap-1.5 px-2 text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8" />
              </svg>
              <span className="sr-only">GitHub</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}