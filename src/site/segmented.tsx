"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";

export interface SegmentedProps<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
  format?: (value: T) => string;
}

/** A tab-like switch with a highlight that slides to the selected option. */
export function Segmented<T extends string>({ value, options, onChange, label, size = "md", format = (v) => v }: SegmentedProps<T>) {
  const id = useId();
  // Keyboard changes are instant; only pointer changes slide the highlight.
  const [keyboard, setKeyboard] = useState(false);
  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = options.indexOf(value);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      setKeyboard(true);
      const next = options[(index + (event.key === "ArrowRight" ? 1 : -1) + options.length) % options.length];
      onChange(next);
      document.getElementById(`${id}-${next}`)?.focus();
    }
  };
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} onPointerDown={() => setKeyboard(false)} className="inline-flex max-w-full overflow-x-auto no-scrollbar rounded-lg bg-surface-2 p-0.5">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            id={`${id}-${option}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option)}
            className={`relative shrink-0 rounded-md font-medium transition-colors duration-150 pointer-coarse:min-h-10 ${size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-[13px]"} ${selected ? "text-foreground" : "text-secondary hover:text-foreground"}`}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-md bg-background shadow-[0_1px_2px_oklch(0_0_0/0.08),0_0_0_1px_oklch(0_0_0/0.04)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.06)]"
                transition={keyboard ? { duration: 0 } : { type: "spring", visualDuration: 0.25, bounce: 0 }}
              />
            )}
            <span className="relative">{format(option)}</span>
          </button>
        );
      })}
    </div>
  );
}
