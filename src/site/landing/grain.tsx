import { useId } from "react";

/**
 * Film grain at about 3% so large flat areas do not band. Drawn as an SVG filter rather than a
 * background image, which would count as the page's largest paint. Used on the hero and footer only.
 */
export function Grain() {
  const id = useId();
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-[0.035] mix-blend-overlay dark:opacity-[0.05]">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
