"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";

type Item = { q: string; a: string };

// A soft spring for the panel and a slightly livelier one for the plus, which overshoots a hair past 45deg.
const panel = { type: "spring", visualDuration: 0.45, bounce: 0 } as const;
const icon = { type: "spring", visualDuration: 0.4, bounce: 0.35 } as const;

/**
 * One question open at a time. Each answer opens by animating grid rows from 0fr to 1fr, so the
 * height follows the content exactly with no measuring, while the answer fades in and the plus turns
 * into a cross.
 */
export function FaqAccordion({ items }: { items: Item[] }) {
  const id = useId();
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q} className="rounded-lg bg-background p-5 ring-1 ring-[var(--hairline)] transition-shadow duration-200 hover:ring-foreground/15">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(expanded ? -1 : i)}
              className="flex w-full cursor-pointer items-start gap-4 text-left"
            >
              <span className="flex-1 text-lg font-medium leading-tight tracking-[-0.02em] md:text-xl">{item.q}</span>
              <motion.svg viewBox="0 0 20 20" aria-hidden className="mt-0.5 size-5 shrink-0" animate={{ rotate: expanded ? 45 : 0 }} transition={icon}>
                <path d="M10 3.5V16.5M3.5 10H16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </motion.svg>
            </button>
            <motion.div
              id={`${id}-${i}`}
              role="region"
              className="grid"
              initial={false}
              animate={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
              transition={{ gridTemplateRows: panel, opacity: { duration: expanded ? 0.3 : 0.15 } }}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="mt-2 max-w-xl pr-9 text-base text-secondary [text-wrap:pretty]">{item.a}</p>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
