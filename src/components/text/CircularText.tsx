"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Text laid out around the perimeter of a circle, continuously rotating
 * like a spinning badge or wax seal.
 */
export default function CircularText({
  text,
  radius = 72,
  rotationDuration = 26,
}: {
  text: string;
  radius?: number;
  rotationDuration?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const size = radius * 2 + 40;
  const pathId = `circular-path-${text.length}-${radius}`;

  useGSAP(
    () => {
      gsap.to(svgRef.current, {
        rotation: 360,
        transformOrigin: "center center",
        duration: rotationDuration,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: svgRef }
  );

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="inline-block">
      <defs>
        <path
          id={pathId}
          d={`M ${size / 2} ${size / 2 - radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 ${-radius * 2}`}
        />
      </defs>
      <text fill="currentColor" fontSize={Math.round(radius * 0.22)} letterSpacing="0.1em">
        <textPath href={`#${pathId}`} startOffset="0">
          {text}
        </textPath>
      </text>
    </svg>
  );
}