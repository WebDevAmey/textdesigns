import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Join class names; later Tailwind classes win over earlier ones, so a caller's className overrides defaults. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
