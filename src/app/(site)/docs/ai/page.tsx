import Link from "next/link";
import { site } from "@/site/config";
import { Code, DocPage } from "@/site/doc-page";

export const metadata = { title: "AI and MCP", description: "Connect Claude Code, Cursor, VS Code and Codex to Textlab through MCP, llms.txt and Markdown docs." };

export default function AiDocs() {
  const mcp = `${site.url}/api/mcp`;
  return (
    <DocPage title="AI and MCP" lead="Textlab is written to be read by agents. Point your AI tool at it and it can find the right effect, read its props and install it.">
      <h2 id="mcp">Connect the MCP server</h2>
      <p>A read-only server over streamable HTTP. No key and no sign-in.</p>
      <h3>Claude Code</h3>
      <Code lang="bash" code={`claude mcp add --transport http textlab ${mcp}`} />
      <h3>Cursor, VS Code and others</h3>
      <Code lang="json" label="mcp.json" code={`{\n  "mcpServers": {\n    "textlab": { "url": "${mcp}" }\n  }\n}`} />
      <h3>Clients that only speak stdio</h3>
      <Code lang="bash" code={`claude mcp add textlab -- node mcp/server.mjs`} />
      <p>
        The stdio bridge in <code>mcp/server.mjs</code> forwards to the hosted server. Set <code>TEXTLAB_URL</code> to use a local copy.
      </p>
      <h3>Tools</h3>
      <ul>
        <li>
          <code>search_components</code>: find effects by intent, such as &quot;a number that changes&quot;.
        </li>
        <li>
          <code>list_components</code>: browse everything, or one category.
        </li>
        <li>
          <code>get_component</code>: when to use it, props, variants, accessibility, motion notes, install command and the full source.
        </li>
        <li>
          <code>get_install_command</code>: one shadcn command for several components.
        </li>
        <li>
          <code>get_tokens</code>: the CSS tokens and motion tokens.
        </li>
      </ul>

      <h2 id="skill">Add the agent skill</h2>
      <p>
        The <Link href="/r/skills/textlab/SKILL.md">Textlab skill</Link> teaches an agent when to reach for a component, how to install it and which rules to keep. Save it to <code>.claude/skills/textlab/SKILL.md</code>, or paste its rules into <code>AGENTS.md</code>.
      </p>

      <h2 id="context">Readable context</h2>
      <ul>
        <li>
          <Link href="/llms.txt">llms.txt</Link>: every component with a one-line job and a link to its Markdown.
        </li>
        <li>
          <Link href="/llms-small.txt">llms-small.txt</Link>: one line per component, for small context windows.
        </li>
        <li>
          <Link href="/llms-full.txt">llms-full.txt</Link>: the whole library as one Markdown file.
        </li>
        <li>
          Any component as Markdown: add <code>.md</code> to its page URL, for example <Link href="/components/scramble-text.md">/components/scramble-text.md</Link>.
        </li>
        <li>
          <Link href="/r/registry.json">Registry index</Link> and <Link href="/r/catalog.json">catalog</Link> with metadata for every item.
        </li>
      </ul>

      <h2 id="prompt">Try a prompt</h2>
      <Code
        lang="bash"
        label="Prompt"
        code={`Add a hero to the landing page with Textlab. Use the Textlab MCP server to find a title\nreveal and an animated counter for the stats row. Install them with the shadcn CLI and\ncheck the page with reduced motion turned on.`}
      />
    </DocPage>
  );
}
