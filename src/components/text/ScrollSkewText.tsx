"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollSkewTextProps {
  text: string;
}

export default function ScrollSkewText({ text }: ScrollSkewTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const skewTo = gsap.quickTo(textRef.current, "skewY", {
      duration: 0.4,
      ease: "power3.out",
    });
    const clampSkew = gsap.utils.clamp(-16, 16);

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => skewTo(clampSkew(self.getVelocity() / -300)),
    });

    const resetSkew = () => skewTo(0);
    ScrollTrigger.addEventListener("scrollEnd", resetSkew);

    return () => {
      trigger.kill();
      ScrollTrigger.removeEventListener("scrollEnd", resetSkew);
    };
  });

  return (
    <h1 ref={textRef} className="inline-block will-change-transform">
      {text}
    </h1>
  );
}
