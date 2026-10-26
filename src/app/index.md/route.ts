import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { site } from "@/site/config";

export const dynamic = "force-static";

/** The landing page as Markdown, for agents: the same facts and commands without the motion. */
export function GET() {
  const variants = catalog.reduce((n, c) => n + c.variants.length, 0);
  const body = `# Textlab

Type that moves. ${catalog.length} text effects for React. One command each. The source lands in your repo.

Works with React 19, Next.js, Tailwind CSS 4, Motion and shadcn/ui.

## Install an effect

\`\`\`bash
npx shadcn@latest add ${site.namespace}/blur-reveal
\`\`\`

The file lands at \`components/textlab/blur-reveal/blur-reveal.tsx\`. Use it:

\`\`\`tsx
<BlurReveal text="Hello" variant="words" />
\`\`\`

## For agents

\`\`\`bash
claude mcp add --transport http textlab ${site.url}/api/mcp
\`\`\`

- Index of every component: ${site.url}/llms.txt
- Each component has a Markdown page at ${site.url}/components/<name>/markdown

## The details

1. Source in your repo. No package to update.
2. Accessible by default. Screen readers hear the sentence once. Reduced motion gets still text.
3. Motion with intent. Shared easing tokens, hand-tuned durations.
4. Ready for your agent. Markdown docs, llms.txt, MCP server.

${catalog.length} effects, ${categories.length} groups, ${variants} variants, 363 tests including an axe check on every component. Free and MIT licensed. No runtime package.

## Groups

${categories.map((c) => `- ${c.title}: ${c.blurb.toLowerCase()} (${catalog.filter((x) => x.category === c.id).length})`).join("\n")}

Browse all effects: ${site.url}/components
`;
  return new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
