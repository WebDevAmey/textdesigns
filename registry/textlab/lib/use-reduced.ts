import { useSyncExternalStore } from "react";

export type ReducedMotion = "user" | "always" | "never";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getClient = () => (typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(QUERY).matches);
const getServer = () => false;

/**
 * Whether this component should skip motion.
 * `user` follows the OS setting, `always` forces the still version, `never` ignores the setting.
 * During server render this is false; the stylesheet in text-fx-tokens covers the gap before hydration.
 */
export function useReduced(setting: ReducedMotion = "user"): boolean {
  const prefers = useSyncExternalStore(subscribe, getClient, getServer);
  if (setting === "always") return true;
  if (setting === "never") return false;
  return prefers;
}
