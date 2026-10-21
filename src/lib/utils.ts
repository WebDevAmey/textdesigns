/** Join class names, skipping falsy values. Used by components installed from other shadcn registries. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
