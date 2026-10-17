import { useId } from "react";

/** A stable id that is safe inside url(#…) references. */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
