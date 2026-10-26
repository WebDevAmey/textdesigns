import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** A small pill label above a heading, with a soft top-lit sheen. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[linear-gradient(#ffffff,#ededed_45%,#fafafa)] px-3 text-xs font-medium uppercase tracking-[-0.01em] text-black/55 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/15 dark:bg-[linear-gradient(#2a2a2a,#1c1c1c_45%,#242424)] dark:text-white/60 dark:ring-white/15">
      {children}
    </span>
  );
}

/** Centered section heading: eyebrow pill, title, one supporting sentence, optional action under it. */
export function SectionHead({ id, eyebrow, title, body, action }: { id: string; eyebrow?: string; title: string; body?: string; action?: ReactNode }) {
  return (
    <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-4 font-display text-4xl font-medium tracking-[-0.035em] [text-wrap:balance] md:text-[56px] md:leading-[1.1]">
        {title}
      </h2>
      {body && <p className="mt-4 text-lg text-secondary [text-wrap:balance] md:text-xl">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Reveal>
  );
}
