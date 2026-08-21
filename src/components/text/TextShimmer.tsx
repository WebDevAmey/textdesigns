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
  trigger?: "auto" | "hover";
}

export default function TextShimmer({
  text,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
  trigger = "auto",
}: TextShimmerProps) {
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);

  const dynamicSpread = useMemo(() => {
    return text.length * spread;
  }, [text, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-clip-text",
        "text-transparent dark:[--base-color:#1d4ed8] dark:[--base-gradient-color:#60a5fa]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={
        trigger === "auto" ? { backgroundPosition: "0% center" } : undefined
      }
      whileHover={
        trigger === "hover" ? { backgroundPosition: "0% center" } : undefined
      }
      transition={{
        repeat: trigger === "auto" ? Infinity : 0,
        duration,
        ease: "linear",
      }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: `linear-gradient(90deg, #0000 calc(50% - var(--spread)), var(--base-gradient-color, #bfdbfe), #0000 calc(50% + var(--spread))), linear-gradient(var(--base-color, #2563eb), var(--base-color, #2563eb))`,
          backgroundSize: "250% 100%, auto",
          backgroundRepeat: "no-repeat, padding-box",
        } as React.CSSProperties
      }
    >
      {text}
    </MotionComponent>
  );
}