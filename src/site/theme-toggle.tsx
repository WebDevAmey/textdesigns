"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    // Suppress every transition for one frame so colors swap at once instead of fading piecemeal.
    root.classList.add("[&_*]:transition-none");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("tl-theme", next ? "dark" : "light");
    } catch {}
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("[&_*]:transition-none")));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex size-9 items-center justify-center rounded-md text-secondary transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.97]"
    >
      <Sun className="size-[18px] scale-100 rotate-0 transition-transform duration-200 ease-enter dark:scale-0 dark:-rotate-90" strokeWidth={1.75} />
      <Moon className="absolute size-[18px] scale-0 rotate-90 transition-transform duration-200 ease-enter dark:scale-100 dark:rotate-0" strokeWidth={1.75} />
    </button>
  );
}
