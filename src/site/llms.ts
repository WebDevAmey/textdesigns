import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { registryUrl, site } from "./config";

const intro = `> Textlab is a React library of text effects: reveals, numbers, typing, light, filters, scroll, drawing, cursor, physics, paths, pixels and kinetic type. Every component installs with the shadcn CLI, copies its source into your project, ships a reduced-motion branch and screen-reader text, and has a Markdown page for agents.`;

const install = `## Install

Each component is a shadcn registry item. It pulls in the shared utilities (\`text-fx\`) and tokens (\`text-fx-tokens\`).

\`\`\`bash
npx shadcn@latest add ${registryUrl("blur-reveal")}
\`\`\`

Or register the namespace once in \`components.json\` and install by name:

\`\`\`json
{ "registries": { "${site.namespace}": "${site.url}/r/{name}.json" } }
\`\`\`

\`\`\`bash
npx shadcn@latest add ${site.namespace}/blur-reveal ${site.namespace}/scramble-text
\`\`\`

Import the tokens once in the root layout: \`import "@/components/textlab/tokens.css";\`. Files install into \`components/textlab/\` and import each other with relative paths. Dark mode: \`.dark\` or \`data-theme="dark"\` on \`<html>\`.`;

const rules = `## Rules for agents

- Prefer an existing Textlab component over writing a new text effect.
- Read the component's Markdown before using it; use only documented props.
- Shared props mean the same thing everywhere: \`text\`, \`as\`, \`variant\`, \`trigger\` (mount, inView, hover, manual), \`active\`, \`once\`, \`delay\`, \`stagger\`, \`duration\`, \`ease\`, \`reducedMotion\`, \`className\`.
- Keep the screen-reader text and the reduced-motion branch when you edit the source.
- Use the tokens (\`--tl-foreground\`, \`--tl-accent\`, \`--tl-fx-*\`) instead of raw colors and check both themes.
- Sentence case copy, no em dashes, no eyebrow labels.`;

const ai = `## AI

- [MCP server](${site.url}/api/mcp): streamable HTTP, read only. Tools: list_components, search_components, get_component, get_install_command, get_tokens.
- [Agent skill](${site.url}/r/skills/textlab/SKILL.md)
- [Registry index](${site.url}/r/registry.json)
- [Catalog](${site.url}/r/catalog.json): metadata for every component.
- [Full context](${site.url}/llms-full.txt): this file with every component's Markdown inlined.
- [Small context](${site.url}/llms-small.txt): one line per component.`;

function list() {
  return categories
    .map((category) => {
      const items = catalog.filter((c) => c.category === category.id);
      if (!items.length) return "";
      return `### ${category.title}\n\n${items.map((c) => `- [${c.title}](${site.url}/components/${c.name}.md): ${c.description}`).join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function llmsIndex() {
  return `# Textlab

${intro}

Textlab has ${catalog.length} components. Free and open source (MIT).

${install}

${rules}

${ai}

## Components

${list()}

## Docs

- [Introduction](${site.url}/docs/introduction)
- [Installation](${site.url}/docs/installation)
- [Tokens](${site.url}/docs/tokens)
- [AI and MCP](${site.url}/docs/ai)
- [Changelog](${site.url}/docs/changelog)
- [Guides](${site.url}/guides)
- [Compare](${site.url}/compare)
- [Roadmap](${site.url}/roadmap)
`;
}

export function llmsSmall() {
  return `# Textlab

${intro}

Install: \`npx shadcn@latest add ${site.url}/r/<name>.json\`, then import \`@/components/textlab/tokens.css\` once.

${catalog.map((c) => `- ${c.name}: ${c.description}`).join("\n")}
`;
}

export function llmsFull(pages: Map<string, string>) {
  return `${llmsIndex()}\n\n---\n\n${[...pages.values()].join("\n\n---\n\n")}`;
}

export function skillMarkdown() {
  return `---
name: textlab
description: Use when adding animated or expressive text to a React app (reveals, counters, typewriters, scramble, gradients, scroll-linked text, cursor effects). Finds the right Textlab component, installs it with the shadcn CLI and keeps accessibility and reduced motion intact.
---

# Textlab

Textlab is a library of ${catalog.length} text effects for React, installed as source with the shadcn CLI.

## Workflow

1. Name the job, then pick the component whose one-line description matches it. Index: ${site.url}/llms.txt
2. Read its Markdown page (${site.url}/components/<name>.md) for props, variants and when not to use it.
3. Install: \`npx shadcn@latest add ${site.url}/r/<name>.json\`. Import \`@/components/textlab/tokens.css\` once in the root layout.
4. Use only documented props. Pick a variant instead of restyling from scratch.
5. Check the page in light and dark themes and with reduced motion on.

${rules}

## Quick picks

- Section title that animates on scroll: in-view-title
- Hero line on load: blur-reveal or word-reveal
- A number that changes: rolling-number; a price: price-ticker
- Loading or thinking label: shimmer-text
- Label that changes state: text-morph
- Long paragraph tied to scroll: scroll-fill
`;
}
