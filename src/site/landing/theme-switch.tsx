"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { withThemeTransition } from "../theme-transition";

type Choice = "light" | "dark" | "system";
const KEY = "tl-theme";

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  // The header toggle changes the theme too; follow the class on <html> so both stay in step.
  const observer = new MutationObserver(fn);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => {
    listeners.delete(fn);
    observer.disconnect();
  };
};
const read = (): Choice => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
};

const isDark = (choice: Choice) => (choice === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : choice === "dark");

/** Light, dark or follow the system, as three small icon buttons. Uses the same key as the no-flash script. */
export function ThemeSwitch() {
  const choice = useSyncExternalStore(subscribe, read, () => "system" as Choice);

  const pick = (next: Choice) => {
    const save = () => {
      try {
        if (next === "system") localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch {}
      listeners.forEach((fn) => fn());
    };
    const dark = isDark(next);
    // Only run the reveal when the visible theme actually changes (system may already match).
    if (dark === document.documentElement.classList.contains("dark")) return save();
    withThemeTransition(() => {
      document.documentElement.classList.toggle("dark", dark);
      save();
    });
  };

  const options: { value: Choice; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: "Light theme", Icon: Sun },
    { value: "dark", label: "Dark theme", Icon: Moon },
    { value: "system", label: "System theme", Icon: Monitor },
  ];

  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex items-center gap-0.5 rounded-full bg-black/5 p-1 dark:bg-white/10">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={choice === value}
          aria-label={label}
          onClick={() => pick(value)}
          className={`inline-flex size-8 items-center justify-center rounded-full transition-colors duration-200 ${choice === value ? "bg-white text-black shadow-sm dark:bg-white/15 dark:text-white" : "text-black/50 hover:text-black dark:text-white/55 dark:hover:text-white"}`}
        >
          <Icon aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
