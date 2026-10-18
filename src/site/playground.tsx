"use client";

import { MotionConfig } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { byName } from "@registry/catalog";
import type { EaseName } from "@registry/textlab/lib/motion-tokens";
import { components } from "@/demos/registry";
import { CopyButton } from "./copy-button";
import { Segmented } from "./segmented";
import { site } from "./config";

/** Effects that read well on any short line of text, in the order the picker shows them. */
const EFFECTS = [
  "blur-reveal",
  "word-reveal",
  "scramble-text",
  "focus-pull",
  "slice-reveal",
  "ember-text",
  "outline-draw",
  "matrix-decode",
  "ink-bleed",
  "tracking-reveal",
  "letter-drop",
  "magnetic-text",
  "jelly-text",
  "wave-text",
  "chromatic-text",
  "glitch-text",
  "aurora-text",
  "shimmer-text",
] as const;

const EASES: EaseName[] = ["enter", "standard", "emphasized", "linear"];
const SPEEDS = ["0.5×", "1×", "1.5×", "2×"] as const;
type Speed = (typeof SPEEDS)[number];
const SPEED_VALUE: Record<Speed, number> = { "0.5×": 0.5, "1×": 1, "1.5×": 1.5, "2×": 2 };

const pascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());

/** Timing props this effect accepts, scaled from its documented defaults. */
function timing(name: string, speed: number, ease: EaseName) {
  const meta = byName(name);
  const out: Record<string, unknown> = {};
  if (!meta) return out;
  const find = (prop: string) => meta.props.find((p) => p.name === prop);
  const duration = find("duration");
  const base = duration?.default ? parseFloat(duration.default) : NaN;
  if (duration && !Number.isNaN(base) && speed !== 1) out.duration = +(base / speed).toFixed(2);
  const cycle = find("speed");
  const cycleBase = cycle?.default ? parseFloat(cycle.default) : NaN;
  if (cycle && !Number.isNaN(cycleBase) && speed !== 1 && cycle.type === "number") out.speed = +(cycleBase / speed).toFixed(2);
  if (find("ease") && ease !== "enter") out.ease = ease;
  return out;
}

function code(name: string, text: string, variant: string, extra: Record<string, unknown>) {
  const meta = byName(name)!;
  const attrs = [`text=${JSON.stringify(text)}`];
  if (variant !== meta.variants[0]) attrs.push(`variant="${variant}"`);
  for (const [k, v] of Object.entries(extra)) attrs.push(typeof v === "string" ? `${k}="${v}"` : `${k}={${v}}`);
  return `// npx shadcn@latest add ${site.namespace}/${name}\nimport { ${meta.exportName} } from "@/components/textlab/${name}/${name}";\n\n<${pascal(name)} ${attrs.join(" ")} />`;
}

/**
 * The homepage's live thing: type a line, pick an effect, tune its speed and easing, and copy the
 * exact JSX. Every choice maps to a documented prop, so the exported code is what you saw.
 */
export function Playground() {
  const id = useId();
  const [text, setText] = useState("Type that moves");
  const [effect, setEffect] = useState<string>(EFFECTS[0]);
  const [variant, setVariant] = useState(byName(EFFECTS[0])!.variants[0]);
  const [speed, setSpeed] = useState<Speed>("1×");
  const [ease, setEase] = useState<EaseName>("enter");
  const [run, setRun] = useState(0);

  const meta = byName(effect)!;
  const Component = components[effect];
  const extra = timing(effect, SPEED_VALUE[speed], ease);
  const shown = text.trim() || "Type that moves";
  const replay = () => setRun((r) => r + 1);

  const pick = (name: string) => {
    setEffect(name);
    setVariant(byName(name)!.variants[0]);
    replay();
  };

  return (
    <section aria-labelledby={`${id}-title`} className="overflow-hidden rounded-2xl bg-surface">
      <h2 id={`${id}-title`} className="sr-only">
        Playground
      </h2>
      <div className="relative flex min-h-[300px] items-center justify-center px-5 py-14 sm:min-h-[380px]">
        <div key={`${effect}-${variant}-${run}-${speed}-${ease}`} className="w-full text-center font-display text-[clamp(2.75rem,9vw,7.5rem)] leading-[1] tracking-[-0.02em]">
          <MotionConfig reducedMotion="never">{Component ? <Component {...meta.preset} text={shown} variant={variant} trigger="mount" {...extra} /> : shown}</MotionConfig>
        </div>
        <button
          type="button"
          onClick={replay}
          aria-label="Replay"
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full text-secondary transition-[color,background-color,transform] duration-150 hover:bg-surface-2 hover:text-foreground active:scale-[0.95]"
        >
          <RotateCcw className="size-[18px] transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `rotate(${-run * 360}deg)` }} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 bg-background/40 p-4 sm:p-6 [&>*]:min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={`${id}-text`} className="w-20 shrink-0 text-sm text-secondary">
            Text
          </label>
          <input
            id={`${id}-text`}
            value={text}
            maxLength={40}
            onChange={(e) => setText(e.target.value)}
            onBlur={replay}
            className="h-11 w-full rounded-lg bg-background px-3 text-[16px] outline-none ring-1 ring-border transition-shadow duration-150 focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <span id={`${id}-effect`} className="w-20 shrink-0 pt-2 text-sm text-secondary">
            Effect
          </span>
          <div role="radiogroup" aria-labelledby={`${id}-effect`} className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {EFFECTS.map((name) => {
              const selected = name === effect;
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => pick(name)}
                  className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97] pointer-coarse:h-11 ${
                    selected ? "bg-foreground text-background" : "bg-background text-secondary hover:text-foreground"
                  }`}
                >
                  {byName(name)!.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-x-0">
          <span className="w-20 text-sm text-secondary">Variant</span>
          <div className="min-w-0">
            <Segmented label="Variant" value={variant} options={meta.variants} onChange={(v) => { setVariant(v); replay(); }} />
          </div>
          <span className="w-20 text-sm text-secondary">Speed</span>
          <div>
            <Segmented label="Speed" value={speed} options={SPEEDS} onChange={(v) => { setSpeed(v); replay(); }} />
          </div>
          <span className="w-20 text-sm text-secondary">Easing</span>
          <div className="min-w-0">
            <Segmented label="Easing" value={ease} options={EASES} onChange={(v) => { setEase(v); replay(); }} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 rounded-xl bg-code p-3 sm:p-4">
          <pre className="no-scrollbar min-w-0 overflow-x-auto font-mono text-[12.5px] leading-6 text-secondary">
            <code>{code(effect, shown, variant, extra)}</code>
          </pre>
          <CopyButton value={code(effect, shown, variant, extra)} label="Copy code" className="size-11 shrink-0" />
        </div>
      </div>
    </section>
  );
}
