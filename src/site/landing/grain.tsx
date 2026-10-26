// A fixed turbulence tile, drawn once by the browser. Decorative only.
const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Film grain at about 3% so large flat areas do not band. Used on the hero and footer only. */
export function Grain() {
  return <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay dark:opacity-[0.05]" style={{ backgroundImage: noise }} />;
}
