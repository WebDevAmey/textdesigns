"use client";

import { useSyncExternalStore } from "react";
import { CopyButton } from "./copy-button";
import { Segmented } from "./segmented";

const managers = ["npm", "pnpm", "yarn", "bun"] as const;
type Manager = (typeof managers)[number];
const runner: Record<Manager, string> = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" };

const KEY = "tl-pm";
const listeners = new Set<() => void>();
const read = (): Manager => {
  try {
    const v = localStorage.getItem(KEY) as Manager | null;
    return v && managers.includes(v) ? v : "npm";
  } catch {
    return "npm";
  }
};
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** The shadcn install line, with the package manager remembered across pages. */
export function InstallCommand({ target }: { target: string }) {
  const stored = useSyncExternalStore(subscribe, read, () => "npm" as Manager);
  const set = (value: Manager) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    listeners.forEach((fn) => fn());
  };
  const command = `${runner[stored]} shadcn@latest add ${target}`;
  return (
    <div className="overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center justify-between border-b px-2 py-1.5">
        <Segmented size="sm" label="Package manager" value={stored} options={managers} onChange={set} format={(v) => v} />
        <CopyButton value={command} label="Copy install command" />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-6 text-foreground">
        <code>
          <span className="select-none text-tertiary">$ </span>
          {command}
        </code>
      </pre>
    </div>
  );
}
