"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface LineRevealProps {
  text: string;
}

export default function LineReveal({
  text,
}: LineRevealProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      const split = new SplitType(textRef.current, {
        types: "lines",
      });

      const lines = split.lines;

      lines.forEach((line) => {
        const wrapper = document.createElement("span");

        wrapper.style.display = "block";
        wrapper.style.overflow = "hidden";

        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      gsap.set(lines, {
        yPercent: 110,
        opacity: 0,
      });

      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
      });

      return () => {
        split.revert();
      };
    },
    { scope: textRef }
  );

  return (
    <h2
      ref={textRef}
      className="mx-auto max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.04em]"
    >
      {text}
    </h2>
  );
}