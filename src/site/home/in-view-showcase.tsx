"use client";

import { useState } from "react";
import { InViewTitle, type InViewTitleVariant } from "@registry/textlab/in-view-title/in-view-title";
import { Segmented } from "../segmented";

const VARIANTS = ["blur", "words", "lines", "wipe"] as const;
const LABELS: Record<InViewTitleVariant, string> = { blur: "Blur", words: "Words", lines: "Lines", wipe: "Wipe" };

/** One title, four entrances. Switching replays the reveal so the styles can be compared. */
export function InViewShowcase() {
  const [variant, setVariant] = useState<InViewTitleVariant>("blur");
  const [run, setRun] = useState(0);
  return (
    <div className="rounded-2xl bg-surface p-5 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-secondary">In-view title, four variants</p>
        <Segmented label="Reveal style" value={variant} options={VARIANTS} format={(v) => LABELS[v]} onChange={(v) => { setVariant(v); setRun((r) => r + 1); }} />
      </div>
      <div className="flex min-h-[220px] items-center sm:min-h-[300px]">
        <InViewTitle key={`${variant}-${run}`} as="h3" variant={variant} text="Make every word count" className="font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[1] tracking-[-0.025em]" />
      </div>
    </div>
  );
}
