import Link from "next/link";
import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { SplitText } from "@registry/textlab/split-text/split-text";
import { StatReveal } from "@registry/textlab/stat-reveal/stat-reveal";
import { Playground } from "@/site/playground";
import { InViewShowcase } from "@/site/home/in-view-showcase";
import { Specimens } from "@/site/home/specimens";
import { Code } from "@/site/doc-page";
import { site } from "@/site/config";

export default function Home() {
  return (
    <main id="main">
      <section className="mx-auto max-w-[1400px] px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        {/* The hero sharpens from a blur without fading in, so it paints at first render and counts for LCP at once. */}
        <SplitText as="h1" trigger="mount" variant="words" from={{ filter: "blur(10px)", y: "0.12em" }} duration={0.9} text="Text, set in motion." className="max-w-[12ch] font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.92] tracking-[-0.035em]" />
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg text-secondary">
            {catalog.length} text effects for React. Live on every page, installed as source with the shadcn CLI, and readable by your AI tools.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/components" className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition-transform duration-150 active:scale-[0.97]">
              Browse the effects
            </Link>
            <Link href="/docs/ai" className="text-[15px] text-secondary underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-current">
              Give it to your AI
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <Playground />
      </section>

      <section aria-labelledby="titles" className="mx-auto mt-32 max-w-[1400px] px-4 sm:mt-44 sm:px-6">
        <h2 id="titles" className="max-w-2xl font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1] tracking-[-0.02em]">
          Titles that arrive as you scroll.
        </h2>
        <p className="mt-4 max-w-lg text-secondary">Blur, words, lines or a wipe: one component, four entrances that share their timing.</p>
        <div className="mt-10">
          <InViewShowcase />
        </div>
      </section>

      <section aria-labelledby="specimen" className="mx-auto mt-32 max-w-[1400px] px-4 sm:mt-44 sm:px-6">
        <h2 id="specimen" className="max-w-2xl font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1] tracking-[-0.02em]">
          Twelve kinds of motion, all of it type.
        </h2>
        <p className="mt-4 max-w-lg text-secondary">
          {categories.map((c) => c.title.toLowerCase()).join(", ")}. A few of them, running at full size:
        </p>
        <Specimens />
        <Link href="/components" className="mt-4 inline-flex h-11 items-center rounded-full bg-surface-2 px-5 text-[15px] font-medium transition-transform duration-150 active:scale-[0.97]">
          See all {catalog.length}
        </Link>
      </section>

      <section aria-labelledby="ai" className="mx-auto mt-32 grid max-w-[1400px] grid-cols-1 gap-10 px-4 sm:mt-44 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start [&>*]:min-w-0">
        <div>
          <h2 id="ai" className="max-w-xl font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1] tracking-[-0.02em]">
            Your agent can install it, too.
          </h2>
          <p className="mt-4 max-w-md text-secondary">
            Every component has a Markdown page and a registry item. The MCP server lets Claude, Cursor or Codex search by intent, read the props and install the right effect.
          </p>
          <Link href="/docs/ai" className="mt-6 inline-flex text-[15px] underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-current">
            Set up AI tools
          </Link>
        </div>
        <div>
          <Code lang="bash" label="Install" code={`npx shadcn@latest add ${site.namespace}/scramble-text`} />
          <Code lang="bash" label="Connect" code={`claude mcp add --transport http textlab ${site.url}/api/mcp`} />
        </div>
      </section>

      <section aria-label="Numbers" className="mx-auto mt-32 grid max-w-[1400px] grid-cols-1 gap-10 px-4 sm:mt-44 sm:grid-cols-3 sm:px-6">
        {[
          { value: catalog.length, label: "Text effects, each with live variants" },
          { value: categories.length, label: "Groups, named by what they do" },
          { value: 363, label: "Tests, including an axe check for every component" },
        ].map((stat) => (
          <div key={stat.label}>
            <StatReveal value={stat.value} className="font-display text-[clamp(4rem,10vw,8rem)] leading-none" />
            <p className="mt-2 max-w-[22ch] text-secondary">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-32 max-w-[1400px] px-4 pb-24 sm:mt-44 sm:px-6">
        <Link href="/components" className="group block">
          <span className="block font-display text-[clamp(4rem,17vw,16rem)] leading-[0.85] tracking-[-0.04em] transition-colors duration-200 group-hover:text-accent">
            Start typing.
          </span>
        </Link>
      </section>
    </main>
  );
}
