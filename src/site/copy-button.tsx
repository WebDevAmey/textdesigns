"use client";

import { AnimatePresence, motion } from "motion/react";
import { easeOut } from "./motion";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const swap = { initial: { opacity: 0, scale: 0.6, filter: "blur(2px)" }, animate: { opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { opacity: 0, scale: 0.6, filter: "blur(2px)" } };

export function CopyButton({ value, label = "Copy", className = "" }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={`relative inline-flex size-8 items-center justify-center rounded-md text-secondary transition-[color,background-color,transform] duration-150 hover:bg-surface-2 hover:text-foreground active:scale-[0.95] ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={copied ? "check" : "copy"} {...swap} transition={{ duration: 0.16, ease: easeOut }} className="inline-flex">
          {copied ? <Check className="size-4" strokeWidth={2} /> : <Copy className="size-4" strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
