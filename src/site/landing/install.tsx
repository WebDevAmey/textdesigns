"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BlurReveal } from "@registry/textlab/blur-reveal/blur-reveal";
import { Typewriter } from "@registry/textlab/typewriter/typewriter";
import { useTrigger } from "@registry/textlab/lib/use-trigger";
import { ease } from "@registry/textlab/lib/motion-tokens";
import { CopyButton } from "../copy-button";
import { Segmented } from "../segmented";

const MODES = ["Human", "Agent"] as const;
type Mode = (typeof MODES)[number];

/**
 * The real install, played as a terminal session: the command types out, the file it writes
 * appears, then the one line of JSX and the effect it renders, live beside it.
 */
export function Install({ install, mcp, file }: { install: string; mcp: string; file: string }) {
  const [mode, setMode] = useState<Mode>("Human");
  const { ref, on } = useTrigger<HTMLDivElement>({ trigger: "inView", once: true });
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const command = mode === "Human" ? install : mcp;

  const line = (visible: boolean, delay = 0) => ({
    initial: { opacity: 0, transform: "translateY(4px)" },
    animate: visible ? { opacity: 1, transform: "translateY(0px)" } : undefined,
    transition: { duration: 0.4, delay, ease: [...ease.enter] as [number, number, number, number] },
  });

  return (
    <section aria-labelledby="install-title" className="relative border-t border-[var(--hairline)] bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-5">
          <h2 id="install-title" className="font-display text-4xl font-semibold tracking-[-0.035em] [text-wrap:balance] md:text-5xl">
            From browsing to shipped in a minute.
          </h2>
          <p className="mt-6 max-w-sm text-lg text-secondary">
            {mode === "Human" ? "Run one command. The component and its helpers land in your project as plain TypeScript." : "Connect the MCP server and your agent can search by intent, read the props and install the right effect."}
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center justify-between gap-4">
            <Segmented size="sm" label="Who is installing" value={mode} options={MODES} onChange={(m) => { setMode(m); setStep(0); }} format={(v) => v} />
            {mode === "Agent" && (
              <a href="/llms.txt" className="label-mono text-tertiary underline decoration-[var(--hairline)] underline-offset-4 transition-colors duration-200 hover:text-foreground">
                llms.txt
              </a>
            )}
          </div>
          <div ref={ref} className="overflow-hidden rounded-2xl bg-[var(--tl-surface)] ring-1 ring-[var(--hairline)]">
            <div className="flex items-center justify-between border-b border-[var(--hairline)] px-4 py-2">
              <span className="label-mono text-tertiary">Terminal</span>
              <CopyButton value={command} label="Copy command" />
            </div>
            <div className="min-h-[260px] space-y-3 overflow-x-auto px-5 py-5 font-mono text-sm leading-6">
              <p className="whitespace-nowrap text-foreground">
                <span className="select-none text-tertiary">$ </span>
                {on && (
                  <Typewriter key={mode} words={[command]} loop={false} typeSpeed={28} humanize={false} trigger="mount" onComplete={() => setTimeout(() => setStep(1), 400)} />
                )}
              </p>
              {mode === "Human" ? (
                <>
                  <motion.p {...line(step >= 1)} onAnimationComplete={() => step === 1 && setTimeout(() => setStep(2), 500)} className="whitespace-nowrap text-secondary">
                    <span className="text-accent">✓</span> {file}
                  </motion.p>
                  <motion.p {...line(step >= 2)} className="whitespace-nowrap text-foreground">
                    {'<BlurReveal text="Hello" variant="words" />'}
                  </motion.p>
                </>
              ) : (
                <motion.p {...line(step >= 1)} className="whitespace-nowrap text-secondary">
                  <span className="text-accent">✓</span> Added MCP server textlab
                </motion.p>
              )}
            </div>
          </div>
          {mode === "Human" && (
            <div className="mt-3 flex min-h-[120px] items-center justify-between gap-4 rounded-2xl px-5 ring-1 ring-[var(--hairline)]">
              <div className="font-display text-5xl font-semibold tracking-[-0.04em]">
                {step >= 2 ? <BlurReveal key={run} text="Hello" variant="word" trigger="mount" /> : <span className="opacity-0">Hello</span>}
              </div>
              {step >= 2 && (
                <button type="button" onClick={() => setRun((r) => r + 1)} className="label-mono h-11 text-tertiary transition-colors duration-200 hover:text-foreground">
                  Replay
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
