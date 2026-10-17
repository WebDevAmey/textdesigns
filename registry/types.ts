/**
 * Metadata for one component. This single object feeds the docs page, the props table,
 * the playground controls, the Markdown page, llms.txt, the registry item and the MCP server.
 */
export type Category =
  | "reveal"
  | "numbers"
  | "typing"
  | "light"
  | "distort"
  | "scroll"
  | "draw"
  | "cursor"
  | "physics"
  | "path"
  | "pixel"
  | "kinetic";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export type Control =
  | { prop: string; kind: "text"; label?: string }
  | { prop: string; kind: "select"; options: string[]; label?: string }
  | { prop: string; kind: "range"; min: number; max: number; step: number; label?: string }
  | { prop: string; kind: "toggle"; label?: string };

export interface ComponentMeta {
  /** Registry name and URL slug, kebab case. */
  name: string;
  /** Sentence case title. */
  title: string;
  /** One line describing the job, in the voice of an action. */
  description: string;
  category: Category;
  /** Exported component name. */
  exportName: string;
  /** npm dependencies the component needs. */
  dependencies: string[];
  /** Extra files in the component folder besides `<name>.tsx`. */
  files?: string[];
  /** Other Textlab components this one imports. */
  uses?: string[];
  variants: string[];
  props: PropDoc[];
  /** Short usage snippet shown on the page and in Markdown. */
  usage: string;
  whenToUse: string[];
  whenNotToUse: string[];
  accessibility: string[];
  motion: string[];
  /** What the reduced-motion branch shows. */
  reducedMotion: string;
  performance: string[];
  responsive?: string[];
  related?: string[];
  keywords?: string[];
  /** Controls exposed in the playground. */
  controls?: Control[];
  /** Props applied in the playground and preview by default. */
  preset?: Record<string, unknown>;
  /** Preview needs a scroll container. */
  scroll?: boolean;
  /** Uses canvas or WebGL. */
  heavy?: boolean;
  /** Date the component was added, YYYY-MM-DD. */
  added: string;
}

export const categories: { id: Category; title: string; blurb: string }[] = [
  { id: "reveal", title: "Reveal", blurb: "Bring text in" },
  { id: "numbers", title: "Numbers", blurb: "Values that move" },
  { id: "typing", title: "Typing", blurb: "Text that writes itself" },
  { id: "light", title: "Light", blurb: "Color, glow and sheen" },
  { id: "distort", title: "Distort", blurb: "Filters that bend type" },
  { id: "scroll", title: "Scroll", blurb: "Driven by the page" },
  { id: "draw", title: "Draw", blurb: "Pen strokes and marks" },
  { id: "cursor", title: "Cursor", blurb: "React to the pointer" },
  { id: "physics", title: "Physics", blurb: "Springs and gravity" },
  { id: "path", title: "Path", blurb: "Type on a curve" },
  { id: "pixel", title: "Pixel", blurb: "Canvas and shaders" },
  { id: "kinetic", title: "Kinetic", blurb: "Choreographed words" },
];

/** Props most components share, so entries stay short and consistent. */
export const commonProps = {
  text: { name: "text", type: "string", description: "The copy.", required: true },
  as: { name: "as", type: "ElementType", default: '"span"', description: "Rendered element." },
  trigger: {
    name: "trigger",
    type: '"mount" | "inView" | "hover" | "manual"',
    default: '"inView"',
    description: "What starts the animation. manual follows `active`.",
  },
  active: { name: "active", type: "boolean", default: "false", description: "Drives trigger=\"manual\"." },
  once: { name: "once", type: "boolean", default: "true", description: "In view: play once instead of on every entry." },
  delay: { name: "delay", type: "number", default: "0", description: "Seconds before the first part moves." },
  stagger: { name: "stagger", type: "number", description: "Seconds between parts." },
  duration: { name: "duration", type: "number", description: "Seconds each part takes." },
  ease: { name: "ease", type: 'EaseName | [number, number, number, number]', default: '"enter"', description: "Easing token or cubic bezier." },
  reducedMotion: {
    name: "reducedMotion",
    type: '"user" | "always" | "never"',
    default: '"user"',
    description: "user follows the OS setting; always shows the still version.",
  },
  className: { name: "className", type: "string", description: "Merged onto the root." },
  onComplete: { name: "onComplete", type: "() => void", description: "Called when a one-shot animation finishes." },
} satisfies Record<string, PropDoc>;
