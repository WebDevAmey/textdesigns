import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** Left aligned section heading with an optional line under it and an optional action on the right. */
export function SectionHead({ id, title, body, action, stacked }: { id: string; title: string; body?: string; action?: ReactNode; stacked?: boolean }) {
  return (
    <div className={stacked ? "flex flex-col items-start gap-6" : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"}>
      <Reveal className="max-w-2xl">
        <h2 id={id} className="font-display text-4xl font-semibold tracking-[-0.035em] [text-wrap:balance] md:text-5xl">
          {title}
        </h2>
        {body && <p className="mt-4 text-lg text-secondary [text-wrap:pretty]">{body}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}
