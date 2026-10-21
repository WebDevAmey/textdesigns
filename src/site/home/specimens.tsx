"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import { AuroraText } from "@registry/textlab/aurora-text/aurora-text";
import { RollingNumber } from "@registry/textlab/rolling-number/rolling-number";
import { ScrambleText } from "@registry/textlab/scramble-text/scramble-text";
import { MarkerHighlight } from "@registry/textlab/marker-highlight/marker-highlight";
import { JellyText } from "@registry/textlab/jelly-text/jelly-text";
import { VariableProximity } from "@registry/textlab/variable-proximity/variable-proximity";
import { useEffect, useState } from "react";

function LiveCount() {
  const [value, setValue] = useState(4096);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => v + Math.ceil(Math.random() * 40)), 2200);
    return () => clearInterval(id);
  }, []);
  return <RollingNumber value={value} className="font-display" />;
}

const rows = [
  { group: "Numbers", href: "/components/rolling-number", note: "Each digit rolls to its new value.", node: <LiveCount /> },
  { group: "Typing", href: "/components/scramble-text", note: "Letters decode into place.", node: <ScrambleText text="Access granted" className="font-display" /> },
  { group: "Cursor", href: "/components/variable-proximity", note: "Weight swells near the pointer.", node: <VariableProximity text="Variable type" className="text-[0.82em]" /> },
  { group: "Draw", href: "/components/marker-highlight", note: "A highlighter swipes behind the words.", node: <span className="font-display">Say it <MarkerHighlight>once</MarkerHighlight>, clearly</span> },
  { group: "Light", href: "/components/aurora-text", note: "Northern lights drift inside the letters.", node: <AuroraText text="After dark" className="font-display" /> },
  { group: "Physics", href: "/components/jelly-text", note: "Letters wobble when you touch them.", node: <JellyText text="Poke the jelly" className="font-display" /> },
];

/** A type specimen: one group per row, its effect running at display size. */
export function Specimens() {
  return (
    <MotionConfig reducedMotion="never">
      <ul>
        {rows.map((row) => (
          <li key={row.group} className="grid items-center gap-4 overflow-hidden py-10 sm:py-14 md:grid-cols-[220px_1fr]">
            <div>
              <Link href={row.href} className="group inline-flex items-baseline gap-2">
                <span className="text-lg font-medium">{row.group}</span>
                <span aria-hidden className="text-secondary transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
              <p className="mt-1 text-[15px] text-secondary">{row.note}</p>
            </div>
            <div className="min-w-0 text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.035em]">{row.node}</div>
          </li>
        ))}
      </ul>
    </MotionConfig>
  );
}
