"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Choice = "light" | "dark" | "system";
const KEY = "tl-theme";

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const read = (): Choice => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
};

const apply = (choice: Choice) => {
  const dark = choice === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : choice === "dark";
  document.documentElement.classList.toggle("dark", dark);
};

/** Light, dark or follow the system, as three small icon buttons. Uses the same key as the no-flash script. */
export function ThemeSwitch() {
  const choice = useSyncExternalStore(subscribe, read, () => "system" as Choice);

  const pick = (next: Choice) => {
    try {
      if (next === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {}
    apply(next);
    listeners.forEach((fn) => fn());
  };

  const options: { value: Choice; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: "Light theme", Icon: Sun },
    { value: "dark", label: "Dark theme", Icon: Moon },
    { value: "system", label: "System theme", Icon: Monitor },
  ];

  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex items-center gap-0.5 rounded-full bg-white/10 p-1">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={choice === value}
          aria-label={label}
          onClick={() => pick(value)}
          className={`inline-flex size-8 items-center justify-center rounded-full transition-colors duration-200 ${choice === value ? "bg-white/15 text-white" : "text-white/55 hover:text-white"}`}
        >
          <Icon aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
