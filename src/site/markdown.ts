import type { ComponentMeta } from "@registry/types";
import { byName, catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { registryUrl, site } from "./config";

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

/** The Markdown page for one component, in the same section order as Arc's. */
export function componentMarkdown(meta: ComponentMeta, files: { path: string; code: string }[] = []): string {
  const category = categories.find((c) => c.id === meta.category)?.title ?? meta.category;
  const page = `${site.url}/components/${meta.name}`;
  const related = (meta.related ?? []).map(byName).filter(Boolean) as ComponentMeta[];
  const siblings = catalog.filter((c) => c.category === meta.category && c.name !== meta.name && !meta.related?.includes(c.name)).slice(0, 4);
  const table = [
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...meta.props.map((p) => `| \`${p.name}\`${p.required ? " (required)" : ""} | \`${p.type.replace(/\|/g, "\\|")}\` | ${p.default ? `\`${p.default}\`` : "–"} | ${p.description} |`),
  ].join("\n");

  return `# ${meta.title}

> ${meta.description}

- Type: Component (${category.toLowerCase()})
- Page: ${page}
- Markdown: ${page}.md
- Registry item: ${registryUrl(meta.name)}
- Source file: \`registry/textlab/${meta.name}/${meta.name}.tsx\`
- Dependencies: ${meta.dependencies.join(", ") || "none"}
- Variants: ${meta.variants.join(", ")}
- Keywords: ${(meta.keywords ?? []).join(", ")}

## When to use

${list(meta.whenToUse)}

## When not to use

${list(meta.whenNotToUse)}

## Installation

### CLI

\`\`\`bash
npx shadcn@latest add ${site.namespace}/${meta.name}
pnpm dlx shadcn@latest add ${site.namespace}/${meta.name}
\`\`\`

The \`${site.namespace}\` name needs \`"registries": { "${site.namespace}": "${site.url}/r/{name}.json" }\` in \`components.json\`. Without it, use the full URL:

\`\`\`bash
npx shadcn@latest add ${registryUrl(meta.name)}
\`\`\`

Import the tokens once in your root layout: \`import "@/components/textlab/tokens.css";\`

### Manual

1. Install the dependencies: \`npm install ${meta.dependencies.join(" ") || "motion"}\`
2. Copy \`text-fx\` (${registryUrl("text-fx")}) and this component into \`components/textlab/\`.

## Usage

\`\`\`tsx
import { ${meta.exportName} } from "@/components/textlab/${meta.name}/${meta.name}";

export function Example() {
  return ${meta.usage};
}
\`\`\`

## API reference

### ${meta.exportName}

${table}

## Accessibility

${list(meta.accessibility)}

## Motion

${list(meta.motion)}

## Reduced motion

${meta.reducedMotion}
${meta.responsive?.length ? `\n## Responsive behavior\n\n${list(meta.responsive)}\n` : ""}
## Performance

${list(meta.performance)}

## Notes for AI

- Use only the props documented above. Do not invent props.
- Keep the screen-reader text and the reduced-motion branch when editing the source.
- Pick a variant from: ${meta.variants.join(", ")}.
${related.length ? `\n## Related\n\n${related.map((r) => `- [${r.title}](${site.url}/components/${r.name}.md): ${r.description}`).join("\n")}\n` : ""}${siblings.length ? `\n## Also in ${category.toLowerCase()}\n\n${siblings.map((r) => `- [${r.title}](${site.url}/components/${r.name}.md): ${r.description}`).join("\n")}\n` : ""}${files.length ? `\n## Source\n\n${files.map((f) => `### ${f.path}\n\n\`\`\`tsx\n${f.code.trimEnd()}\n\`\`\``).join("\n\n")}\n` : ""}
Full library index: ${site.url}/llms.txt
`;
}
