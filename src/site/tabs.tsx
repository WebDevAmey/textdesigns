"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

/** Preview and Code tabs. Panels crossfade quickly; the indicator slides. */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const id = useId();
  const [active, setActive] = useState(tabs[0].id);
  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active);
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = tabs[(i + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(`${id}-tab-${next.id}`)?.focus();
  };
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div>
      <div role="tablist" aria-label="View" onKeyDown={onKeyDown} className="mb-3 flex gap-4 border-b">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`${id}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={`relative -mb-px pb-2.5 text-sm font-medium transition-colors duration-150 ${selected ? "text-foreground" : "text-secondary hover:text-foreground"}`}
            >
              {tab.label}
              {selected && (
                <motion.span layoutId={`${id}-underline`} className="absolute inset-x-0 -bottom-px h-px bg-foreground" transition={{ type: "spring", visualDuration: 0.25, bounce: 0 }} />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${current.id}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
