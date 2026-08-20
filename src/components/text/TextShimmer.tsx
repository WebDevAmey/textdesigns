"use client";

import React, { useMemo, type JSX } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export default function TextShimmer({
  text,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);

  const dynamicSpread = useMemo(() => {
    return text.length * spread;
  }, [text, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-clip-text",
        "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]",
        "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: `linear-gradient(90deg, #0000 calc(50% - var(--spread)), var(--base-gradient-color), #0000 calc(50% + var(--spread))), linear-gradient(var(--base-color), var(--base-color))`,
          backgroundSize: "250% 100%, auto",
          backgroundRepeat: "no-repeat, padding-box",
        } as React.CSSProperties
      }
    >
      {text}
    </MotionComponent>
  );
}