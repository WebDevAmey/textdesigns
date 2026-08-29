"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollSkewTextProps {
  text: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollSkewText({ text, containerRef }: ScrollSkewTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const skewTo = gsap.quickTo(textRef.current, "skewY", {
      duration: 0.4,
      ease: "power3.out",
    });
    const clampSkew = gsap.utils.clamp(-16, 16);

    const trigger = ScrollTrigger.create({
      scroller: containerRef?.current || undefined,
      onUpdate: (self) => skewTo(clampSkew(self.getVelocity() / -300)),
    });

    const resetSkew = () => skewTo(0);
    ScrollTrigger.addEventListener("scrollEnd", resetSkew);

    return () => {
      trigger.kill();
      ScrollTrigger.removeEventListener("scrollEnd", resetSkew);
    };
  }, [containerRef]);

  return (
    <h1 ref={textRef} className="inline-block will-change-transform">
      {text}
    </h1>
  );
}
