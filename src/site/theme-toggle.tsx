"use client";

import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useReduced } from "@registry/textlab/lib/use-reduced";

/**
 * Magic UI's animated theme toggler with the triangle reveal, growing from the middle of the screen. It runs controlled so the choice is
 * saved under the same key the no-flash script in the layout reads.
 */
export function ThemeToggle() {
  const reduced = useReduced();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedThemeToggler
      variant="triangle"
      fromCenter
      duration={reduced ? 1 : 520}
      theme={theme}
      onThemeChange={(next) => {
        setTheme(next);
        try {
          localStorage.setItem("tl-theme", next);
        } catch {}
      }}
      aria-label="Toggle theme"
      className="inline-flex size-9 items-center justify-center rounded-md text-secondary transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.97] pointer-coarse:size-11 [&_svg]:size-[18px] [&_svg]:stroke-[1.75]"
    />
  );
}
