import type { ComponentMeta } from "@registry/types";
import { registryUrl, site } from "./config";

export interface RegistryFile {
  path: string;
  type: "registry:component" | "registry:lib" | "registry:file" | "registry:hook";
  target: string;
  content: string;
}

export interface RegistryItem {
  $schema: string;
  name: string;
  type: "registry:ui" | "registry:lib" | "registry:style" | "registry:file";
  title: string;
  description: string;
  categories?: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  docs?: string;
  meta?: Record<string, unknown>;
}

const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";

/**
 * Pinned ranges for npm dependencies. Components are written and tested against motion 12;
 * motion 14 changed server rendering in a way that breaks prerendering, so installs stay on 12.
 */
const PINS: Record<string, string> = { motion: "motion@^12.38.0" };
const pin = (deps: string[]) => deps.map((d) => PINS[d] ?? d);

/** Shared utilities every component imports with relative paths. */
export function buildLibItem(files: { file: string; content: string }[]): RegistryItem {
  return {
    $schema: SCHEMA,
    name: "text-fx",
    type: "registry:lib",
    title: "Text fx",
    description: "Shared Textlab utilities: motion tokens, text splitting, triggers, frame loop, pointer and line detection.",
    dependencies: pin(["motion"]),
    files: files.map(({ file, content }) => ({
      path: `registry/textlab/lib/${file}`,
      type: "registry:lib",
      target: `@components/textlab/lib/${file}`,
      content,
    })),
    docs: `Import the tokens once in your root layout: import "@/components/textlab/tokens.css";`,
  };
}

export function buildTokensItem(css: string): RegistryItem {
  return {
    $schema: SCHEMA,
    name: "text-fx-tokens",
    type: "registry:file",
    title: "Text fx tokens",
    description: "Color, type and motion tokens for Textlab, with light and dark themes and the reduced-motion fallback.",
    files: [{ path: "registry/textlab/tokens.css", type: "registry:file", target: "@components/textlab/tokens.css", content: css }],
    docs: `Import once in your root layout: import "@/components/textlab/tokens.css";`,
  };
}

export function buildItem(meta: ComponentMeta, files: { file: string; content: string }[]): RegistryItem {
  return {
    $schema: SCHEMA,
    name: meta.name,
    type: "registry:ui",
    title: meta.title,
    description: meta.description,
    categories: ["text", meta.category],
    dependencies: pin(meta.dependencies),
    registryDependencies: [registryUrl("text-fx"), registryUrl("text-fx-tokens"), ...(meta.uses ?? []).map(registryUrl)],
    files: files.map(({ file, content }) => ({
      path: `registry/textlab/${meta.name}/${file}`,
      type: "registry:component",
      target: `@components/textlab/${meta.name}/${file}`,
      content,
    })),
    docs: `Docs and live preview: ${site.url}/components/${meta.name}`,
    meta: {
      variants: meta.variants,
      docs: `${site.url}/components/${meta.name}`,
      markdown: `${site.url}/components/${meta.name}.md`,
      keywords: meta.keywords ?? [],
    },
  };
}
