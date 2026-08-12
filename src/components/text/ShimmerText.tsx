"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ShimmerTextProps {
  text: string;
  loop?: boolean;
  trigger?: "hover" | "auto";
}

const SLIT_MASK =
  "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))";

export default function ShimmerText({
  text,
  loop = true,
  trigger = "auto",
}: ShimmerTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);

  const runSweep = (el: HTMLElement) => {
    gsap.fromTo(
      el,
      { "--mask-x": "100%" },
      {
        "--mask-x": "-100%",
        duration: 1,
        ease: "linear",
        repeat: loop ? -1 : 0,
        repeatDelay: 1,
      }
    );

    if (shineRef.current) {
      gsap.fromTo(
        shineRef.current,
        { backgroundPosition: "100% 0", opacity: 0 },
        {
          backgroundPosition: "0% 0",
          opacity: [0, 1, 0],
          duration: 1,
          ease: "linear",
          repeat: loop ? -1 : 0,
          repeatDelay: 1,
        } as unknown as gsap.TweenVars
      );
    }
  };

  useGSAP(() => {
    const el = textRef.current;
    if (!el) return;

    if (trigger === "hover") {
      el.addEventListener("mouseenter", () => runSweep(el));
      return () => {
        el.removeEventListener("mouseenter", () => runSweep(el));
      };
    }

    runSweep(el);
  }, [loop, trigger]);

  return (
    <span
      ref={textRef}
      className="relative inline-block"
      style={{
        ["--mask-x" as string]: "100%",
        WebkitMaskImage: SLIT_MASK,
        maskImage: SLIT_MASK,
      }}
    >
      {/* Base text — solid like the button */}
      <span className="inline-block select-none text-neutral-900">
        {text}
      </span>

      {/* Moving shine band over the text, like the button's border shine */}
      <span
        ref={shineRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-clip-text text-transparent select-none bg-[length:200%_100%]"
        style={{
          backgroundImage:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          ["--shine" as string]: "rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </span>
    </span>
  );
}