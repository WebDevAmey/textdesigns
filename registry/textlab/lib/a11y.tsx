import type { CSSProperties, ReactNode } from "react";

/** Visually hidden but read by screen readers. Inline so it works without any stylesheet. */
export const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** The full text for screen readers, read once instead of letter by letter. */
export function SrText({ children }: { children: ReactNode }) {
  return <span style={srOnly}>{children}</span>;
}

/** The animated layer. Hidden from assistive tech because SrText already carries the words. */
export function Visual({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span aria-hidden="true" className={className} style={style}>
      {children}
    </span>
  );
}

/** Join class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
