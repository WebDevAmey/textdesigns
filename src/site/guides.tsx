import Link from "next/link";
import type { ReactNode } from "react";
import { Code } from "./doc-page";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  body: () => ReactNode;
}

export const guides: Guide[] = [
  {
    slug: "animated-hero-headline",
    title: "An animated hero headline",
    description: "Pick a reveal, time it with the rest of the hero, and keep it readable.",
    body: () => (
      <>
        <p>A hero headline has one job: be read. Motion should help it land, not delay it. This guide builds a headline that reveals on load, a subline that follows, and a counter in the stats row.</p>
        <h2>Choose the reveal</h2>
        <ul>
          <li>
            <Link href="/components/blur-reveal">Blur reveal</Link> for calm, premium products.
          </li>
          <li>
            <Link href="/components/word-reveal">Word reveal</Link> for editorial weight.
          </li>
          <li>
            <Link href="/components/wipe-reveal">Wipe reveal</Link> when the line should feel unveiled.
          </li>
        </ul>
        <Code
          code={`import { BlurReveal } from "@/components/textlab/blur-reveal/blur-reveal";\nimport { StatReveal } from "@/components/textlab/stat-reveal/stat-reveal";\n\nexport function Hero() {\n  return (\n    <section>\n      <BlurReveal as="h1" trigger="mount" text="Ship the story, not the slides" />\n      <BlurReveal as="p" trigger="mount" delay={0.35} variant="line" text="Decks that write themselves from your docs." />\n      <StatReveal value={12400} suffix="+" trigger="mount" delay={0.6} />\n    </section>\n  );\n}`}
        />
        <h2>Time it as a sequence</h2>
        <p>Stagger the pieces, not just the letters: the headline first, the subline about a third of a second later, supporting numbers after that. Keep the whole entrance under about 1.2 seconds so nobody waits.</p>
        <h2>Check reduced motion</h2>
        <p>Turn on reduced motion in your OS settings and reload. The headline should be there instantly, with no blur and no movement. Every Textlab component does this out of the box.</p>
      </>
    ),
  },
  {
    slug: "scroll-storytelling",
    title: "Scroll storytelling with text",
    description: "Section titles that arrive as you scroll, and a paragraph that follows the reader.",
    body: () => (
      <>
        <p>Long pages read better when each section announces itself. Use one consistent title entrance and save the expressive effects for one or two key moments.</p>
        <h2>Section titles</h2>
        <Code code={`<InViewTitle variant="lines" text="Everything your team needs to ship" />`} />
        <p>
          Use the same variant for every section. <Link href="/components/in-view-title">In-view title</Link> shows titles that are already above the viewport immediately, so jumping to an anchor never leaves a heading hidden.
        </p>
        <h2>The key paragraph</h2>
        <Code code={`<ScrollFill text="We believe the best interfaces disappear." />`} />
        <p>
          <Link href="/components/scroll-fill">Scroll fill</Link> ties brightness to scroll position, so it reverses when the reader scrolls back. Use it once per page.
        </p>
        <h2>A band between sections</h2>
        <Code code={`<VelocityMarquee text="Available for new projects" />`} />
        <p>
          <Link href="/components/velocity-marquee">Velocity marquee</Link> pauses on hover and focus, which keeps moving text compliant with WCAG 2.2.2.
        </p>
      </>
    ),
  },
  {
    slug: "reduced-motion-for-text",
    title: "Reduced motion for text effects",
    description: "What reduced motion means for type, and how Textlab handles it.",
    body: () => (
      <>
        <p>People turn on reduced motion for vestibular disorders, migraines, focus, or simply preference. For text, the rule is simple: show the final, readable state immediately.</p>
        <h2>What every component does</h2>
        <ul>
          <li>Reveals render the plain text with no transform, blur, clip or mask.</li>
          <li>Counters and typewriters show the value or phrase directly.</li>
          <li>Ambient loops render a single still frame.</li>
          <li>Canvas and WebGL effects fall back to the real text.</li>
        </ul>
        <h2>Before JavaScript loads</h2>
        <p>
          Server-rendered reveals start hidden so they can animate in. The token stylesheet shows them instantly when the OS asks for reduced motion, and shows them anyway after 2.4 seconds if scripts are slow.
        </p>
        <h2>Overriding</h2>
        <Code code={`<ScrambleText text="Preview" reducedMotion="always" />`} />
        <p>
          <code>reducedMotion</code> accepts <code>user</code> (the default), <code>always</code> and <code>never</code>. Use <code>never</code> only for motion that carries meaning and is safe, like a progress indicator.
        </p>
      </>
    ),
  },
  {
    slug: "installing-with-ai-agents",
    title: "Installing Textlab with AI agents",
    description: "Let Claude Code, Cursor or Codex find and install the right effect.",
    body: () => (
      <>
        <p>Agents do their best work when they can read real docs. Textlab gives them three ways in: the MCP server, llms.txt, and a Markdown page per component.</p>
        <h2>Connect once</h2>
        <Code lang="bash" code={`claude mcp add --transport http textlab https://textlab.dev/api/mcp`} />
        <h2>Ask by job, not by markup</h2>
        <Code lang="bash" label="Prompt" code={`Find a Textlab component for a price that changes live and add it to the checkout summary.`} />
        <p>
          The agent calls <code>search_components</code>, reads the match with <code>get_component</code>, and installs it with the shadcn CLI. Because the component&apos;s props are documented, it does not invent any.
        </p>
        <h2>Keep the rules</h2>
        <p>
          Add the <Link href="/docs/ai#skill">Textlab skill</Link> so agents keep screen-reader text and reduced-motion branches when they edit the source.
        </p>
      </>
    ),
  },
];
