import "server-only";
import { byName, catalog } from "@registry/catalog";
import { categories, type ComponentMeta } from "@registry/types";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { registryUrl, site } from "./config";
import { componentMarkdown } from "./markdown";
import { componentFiles } from "./source";

type Json = Record<string, unknown>;

export const tools = [
  {
    name: "list_components",
    description: "List Textlab text effects, optionally filtered by category.",
    inputSchema: {
      type: "object",
      properties: { category: { type: "string", enum: categories.map((c) => c.id), description: "Only this category." } },
    },
  },
  {
    name: "search_components",
    description: "Find text effects by intent, for example 'number that changes' or 'title that reveals on scroll'.",
    inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number" } }, required: ["query"] },
  },
  {
    name: "get_component",
    description: "One component's docs: when to use it, props, variants, accessibility, motion, install command and full source.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Component name, for example scramble-text." }, includeSource: { type: "boolean", default: true } },
      required: ["name"],
    },
  },
  {
    name: "get_install_command",
    description: "One shadcn command that installs several components.",
    inputSchema: { type: "object", properties: { names: { type: "array", items: { type: "string" } } }, required: ["names"] },
  },
  {
    name: "get_tokens",
    description: "Textlab's CSS tokens (color, type, motion) and the motion token TypeScript module.",
    inputSchema: { type: "object", properties: {} },
  },
] as const;

const summary = (m: ComponentMeta) => ({ name: m.name, title: m.title, description: m.description, category: m.category, variants: m.variants, docs: `${site.url}/components/${m.name}` });

function score(meta: ComponentMeta, words: string[]) {
  const hay = {
    name: meta.name.replace(/-/g, " "),
    text: [meta.title, meta.description, ...(meta.keywords ?? []), ...meta.whenToUse, meta.category].join(" ").toLowerCase(),
  };
  return words.reduce((s, w) => s + (hay.name.includes(w) ? 3 : 0) + (hay.text.includes(w) ? 1 : 0), 0);
}

const text = (value: unknown) => ({ content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] });

export async function callTool(name: string, args: Json = {}) {
  switch (name) {
    case "list_components": {
      const category = args.category as string | undefined;
      return text(catalog.filter((c) => !category || c.category === category).map(summary));
    }
    case "search_components": {
      const words = String(args.query ?? "").toLowerCase().split(/\W+/).filter((w) => w.length > 1);
      const limit = Number(args.limit ?? 8);
      const ranked = catalog
        .map((m) => ({ m, s: score(m, words) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, limit)
        .map((r) => summary(r.m));
      return text(ranked.length ? ranked : "No match. Try list_components.");
    }
    case "get_component": {
      const meta = byName(String(args.name ?? ""));
      if (!meta) return { ...text(`Unknown component "${args.name}". Use list_components.`), isError: true };
      const files = args.includeSource === false ? [] : await componentFiles(meta);
      return text(componentMarkdown(meta, files));
    }
    case "get_install_command": {
      const names = (Array.isArray(args.names) ? args.names : []).map(String);
      const unknown = names.filter((n) => !byName(n));
      if (unknown.length) return { ...text(`Unknown: ${unknown.join(", ")}`), isError: true };
      return text(
        `npx shadcn@latest add ${names.map(registryUrl).join(" ")}\n\nThen import the tokens once in your root layout:\nimport "@/components/textlab/tokens.css";`,
      );
    }
    case "get_tokens": {
      const root = path.join(process.cwd(), "registry", "textlab");
      const [css, ts] = await Promise.all([readFile(path.join(root, "tokens.css"), "utf8"), readFile(path.join(root, "lib", "motion-tokens.ts"), "utf8")]);
      return text(`## tokens.css\n\n\`\`\`css\n${css}\`\`\`\n\n## motion-tokens.ts\n\n\`\`\`ts\n${ts}\`\`\``);
    }
    default:
      return { ...text(`Unknown tool ${name}`), isError: true };
  }
}
