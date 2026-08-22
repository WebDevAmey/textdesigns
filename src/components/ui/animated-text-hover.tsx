"use client"

import { useRef, useState } from "react"

interface AnimatedTextHoverProps {
  text?: string
  fontSize?: number
  minWeight?: number
  maxWeight?: number
  animationDuration?: number
  staggerDelay?: number
}

/**
 * AnimatedTextHover — variable font weight animation triggered on hover.
 *
 * Mathematical model:
 *   delay(i) = (i - numLetters/2) × staggerDelay
 *   weight(i, hovered) = hovered ? maxWeight : minWeight
 *
 * Each character transitions between minWeight and maxWeight on hover,
 * with delays staggered from the center outward.
 */
export function AnimatedTextHover({
  text = "Hover me",
  fontSize = 100,
  minWeight = 100,
  maxWeight = 900,
  animationDuration = 0.6,
  staggerDelay = 0.04,
}: AnimatedTextHoverProps) {
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLParagraphElement>(null)

  const characters = text.split("")

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p
        ref={containerRef}
        aria-label={text}
        className="font-sans m-0 cursor-pointer select-none"
        style={{
          fontSize: `${fontSize}px`,
          fontFeatureSettings: '"wght"',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {characters.map((char, i) => {
          const mappedIndex = i - characters.length / 2
          const delay = mappedIndex * staggerDelay

          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "inline-block",
                transition: `font-variation-settings ${animationDuration}s cubic-bezier(0.37, 0, 0.63, 1)`,
                transitionDelay: `${delay}s`,
                fontVariationSettings: `"wght" ${hovered ? maxWeight : minWeight}`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          )
        })}
      </p>
    </div>
  )
}
