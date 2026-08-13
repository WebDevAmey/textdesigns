"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

interface KineticDragTextProps {
  text: string;
}

export default function KineticDragText({ text }: KineticDragTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    const draggables = Draggable.create(chars, {
      type: "x,y",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onThrowComplete() {
        gsap.to(this.target, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.35)",
        });
      },
    });

    return () => {
      draggables.forEach((instance) => instance.kill());
      split.revert();
    };
  });

  return (
    <h1 ref={textRef} className="inline-block cursor-grab select-none">
      {text}
    </h1>
  );
}
