import { flushSync } from "react-dom";
import { getThemeTransitionClipPaths } from "@/components/ui/animated-theme-toggler";

/**
 * Run a theme change behind the same triangle reveal the header toggle uses: the new theme grows
 * from the middle of the screen. Falls back to an instant switch without view transitions or when
 * motion is reduced.
 */
export function withThemeTransition(apply: () => void, duration = 520) {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof document.startViewTransition !== "function" || root.dataset.magicuiThemeVt === "active") {
    apply();
    return;
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const x = w / 2;
  const y = h / 2;
  const clipPath = getThemeTransitionClipPaths("triangle", x, y, Math.hypot(x, y), w, h);

  root.dataset.magicuiThemeVt = "active";
  root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
  root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);
  const cleanup = () => {
    delete root.dataset.magicuiThemeVt;
    root.style.removeProperty("--magicui-theme-toggle-vt-duration");
    root.style.removeProperty("--magicui-theme-vt-clip-from");
  };

  const transition = document.startViewTransition(() => flushSync(apply));
  transition.finished.finally(cleanup).catch(() => {});
  transition.ready
    .then(() => {
      root.animate({ clipPath }, { duration, easing: "ease-in-out", fill: "forwards", pseudoElement: "::view-transition-new(root)" });
    })
    .catch(() => {});
}
