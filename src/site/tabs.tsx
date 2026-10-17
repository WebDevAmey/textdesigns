"use client";

import { AnimatePresence, motion } from "motion/react";
import { easeOut } from "./motion";
import { useId, useState, type ReactNode } from "react";

/** Preview and Code tabs. Panels crossfade quickly; the indicator slides. */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const id = useId();
  const [active, setActive] = useState(tabs[0].id);
  // Keyboard switching is instant; animating it would make arrowing through tabs feel slow.
  const [keyboard, setKeyboard] = useState(false);
  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active);
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    setKeyboard(true);
    const next = tabs[(i + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(`${id}-tab-${next.id}`)?.focus();
  };
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div>
      <div role="tablist" aria-label="View" onKeyDown={onKeyDown} onPointerDown={() => setKeyboard(false)} className="mb-3 flex gap-4 border-b">
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
                <motion.span
                  layoutId={`${id}-underline`}
                  className="absolute inset-x-0 -bottom-px h-px bg-foreground"
                  transition={keyboard ? { duration: 0 } : { type: "spring", visualDuration: 0.25, bounce: 0 }}
                />
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
          initial={keyboard ? false : { opacity: 0, transform: "translateY(4px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={{ opacity: 0, transition: { duration: keyboard ? 0 : 0.1 } }}
          transition={{ duration: 0.18, ease: easeOut }}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
