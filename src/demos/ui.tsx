"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Small, quiet controls that sit under a demo without competing with it. */
export function DemoButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`rounded-md border bg-background px-2.5 py-1 font-sans text-[13px] font-medium tracking-normal text-secondary transition-[color,border-color,transform] duration-150 ease-enter hover:border-foreground/25 hover:text-foreground active:scale-[0.97] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DemoControls({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex flex-wrap items-center justify-center gap-2">{children}</div>;
}

export function DemoStage({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col items-center">{children}</div>;
}
