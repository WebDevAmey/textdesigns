"use client";

import { CopyButton } from "../copy-button";

/** The one command a visitor needs, set like a terminal line with a copy button. */
export function HeroInstall({ command }: { command: string }) {
  return (
    <div className="inline-flex h-11 min-w-0 max-w-full items-center gap-2 rounded-full bg-surface pl-4 pr-1.5 ring-1 ring-border">
      <code className="no-scrollbar min-w-0 overflow-x-auto whitespace-nowrap font-mono text-sm text-secondary">
        <span className="select-none text-tertiary">$ </span>
        {command}
      </code>
      <CopyButton value={command} label="Copy install command" className="shrink-0 rounded-full" />
    </div>
  );
}
