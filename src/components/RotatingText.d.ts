import type { CSSProperties } from "react";

interface RotatingTextProps {
  texts: string[];
  transition?: object;
  initial?: object;
  animate?: object;
  exit?: object;
  animatePresenceMode?: "sync" | "wait" | "popLayout";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  style?: CSSProperties;
}

declare const RotatingText: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<RotatingTextProps> & React.RefAttributes<unknown>
>;

export default RotatingText;