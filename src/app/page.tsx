import Link from "next/link";
import { ArrowRight, Bot, Code2, PersonStanding, Waves } from "lucide-react";
import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { SplitText } from "@registry/textlab/split-text/split-text";
import { StatReveal } from "@registry/textlab/stat-reveal/stat-reveal";
import { ScrollFill } from "@registry/textlab/scroll-fill/scroll-fill";
import { Playground } from "@/site/playground";
import { Bento } from "@/site/home/bento";
import { Faq } from "@/site/home/faq";
import { HeroInstall } from "@/site/home/hero-install";
import { Reveal } from "@/site/home/reveal";
import { Code } from "@/site/doc-page";
import { site } from "@/site/config";
import { GithubStar } from "@/site/github-star";

const total = catalog.length;
const installLine = `npx shadcn@latest add ${site.namespace}/blur-reveal`;
const arrow = "size-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5";

const stack = ["React 19", "Next.js", "Tailwind CSS 4", "Motion", "shadcn/ui", "TypeScript"];

const benefits = [
  { icon: Code2, title: "Source in your repo", body: "The shadcn CLI copies each effect into your components folder. No package to update, nothing hidden behind an API." },
  { icon: PersonStanding, title: "Accessible by default", body: "Screen readers hear the sentence once. Reduced motion gets still, readable text. Every effect passes an axe check." },
  { icon: Waves, title: "Motion with intent", body: "Shared easing tokens, springs that settle without wobble, and durations tuned by hand so effects feel quick but soft." },
  { icon: Bot, title: "Ready for your agent", body: "Markdown docs, llms.txt and an MCP server let Claude, Cursor or Codex find the right effect and install it." },
];

const steps = [
  { title: "Pick an effect", body: "Browse live previews, switch variants and replay them until one fits the moment.", code: "/components/blur-reveal" },
  { title: "Install it", body: "Run one command. The component and its helpers land in your project as plain TypeScript.", code: installLine },
  { title: "Make it yours", body: "Pass text and a variant, tune duration and easing, or open the file and change anything.", code: '<BlurReveal text="Hello" variant="words" />' },
];

function PrimaryCta() {
  return (
    <Link
      href="/components"
      className="group inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-base font-semibold text-background transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98]"
    >
      Browse all {total} effects
      <ArrowRight aria-hidden className={arrow} strokeWidth={2} />
    </Link>
  );
}

function SectionHead({ eyebrow, title, body, id }: { eyebrow: string; title: string; body?: string; id: string }) {
  return (
    <Reveal className="max-w-[680px]">
      <p className="text-sm font-medium text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-4xl tracking-tight [text-wrap:balance] sm:text-5xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-lg text-secondary [text-wrap:pretty]">{body}</p>}
    </Reveal>
  );
}

export default function Home() {
  return (
    <main id="main" className="overflow-x-clip">
      {/* Hero: one promise, one primary action, proof right under it. */}
      <section className="mx-auto flex max-w-[1400px] flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <Link href="/docs/changelog" className="group inline-flex items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 text-sm text-secondary ring-1 ring-border transition-colors duration-300 hover:text-foreground">
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">New</span>
          Gooey, glitch and nine more effects, rebuilt
          <ArrowRight aria-hidden className={arrow} />
        </Link>
        {/* The hero sharpens from a blur without fading in, so it paints at first render and counts for LCP at once. */}
        <h1 className="mt-8 max-w-[680px] font-display text-5xl leading-none tracking-[-0.045em] sm:text-7xl">
          <SplitText as="span" trigger="mount" variant="words" from={{ filter: "blur(10px)", y: "0.12em" }} duration={0.9} text="Animated text for React," className="block" />
          <SplitText as="span" trigger="mount" variant="words" from={{ filter: "blur(10px)", y: "0.12em" }} duration={0.9} delay={0.15} text="installed in one command." className="block text-tertiary" />
        </h1>
        <p className="mt-6 max-w-[680px] text-lg text-secondary [text-wrap:balance]">
          {total} text effects, from blur reveals to gooey morphs. Each one lands in your repo as source, respects reduced motion, and ships with docs your AI agent can read.
        </p>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <PrimaryCta />
          <HeroInstall command={installLine} />
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-tertiary">
          <span>Free and MIT licensed</span>
          <span aria-hidden>·</span>
          <span>No runtime package</span>
          <span aria-hidden>·</span>
          <span>{catalog.reduce((n, c) => n + c.variants.length, 0)} variants to choose from</span>
        </p>
      </section>

      {/* The product is the hero visual: type a line and watch it move. */}
      <section aria-label="Playground" className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <Playground />
      </section>

      <section aria-label="Built on" className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6">
        <p className="text-center text-sm text-tertiary">Built on the stack you already use</p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {stack.map((name) => (
            <li key={name} className="font-display text-xl tracking-tight text-secondary">
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="live" className="mx-auto mt-24 max-w-[1400px] px-4 sm:mt-40 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHead id="live" eyebrow="Live components" title="Every example is live." body="Hover, poke or just wait. Nothing on this page is a recording." />
          <Link href="/components" className="group inline-flex items-center gap-2 text-base font-semibold">
            See all {total}
            <ArrowRight aria-hidden className={arrow} />
          </Link>
        </div>
        <div className="mt-12">
          <Bento />
        </div>
      </section>

      <section aria-labelledby="why" className="mx-auto mt-24 max-w-[1400px] px-4 sm:mt-40 sm:px-6">
        <SectionHead id="why" eyebrow="Why Textlab" title="The details are already done." body="Text effects are easy to start and slow to finish. These ship finished." />
        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.08} className="rounded-2xl bg-surface p-6 ring-1 ring-border">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-background text-accent ring-1 ring-border">
                <b.icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-base text-secondary [text-wrap:pretty]">{b.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Tagline: each word lights up as it crosses the reading line. */}
      <section aria-label="Why it matters" className="mx-auto mt-24 max-w-[1400px] px-4 sm:mt-40 sm:px-6">
        <ScrollFill
          as="p"
          dim={0.25}
          offset={["start 0.8", "end 0.5"]}
          text="Most of what people see on your site is text. Give it the same care as everything else, and it becomes the part they remember."
          className="mx-auto max-w-4xl text-center font-display text-4xl leading-tight tracking-tight [text-wrap:balance] sm:text-6xl sm:leading-none"
        />
      </section>

      <section aria-labelledby="how" className="mx-auto mt-24 max-w-[1400px] px-4 sm:mt-40 sm:px-6">
        <SectionHead id="how" eyebrow="How it works" title="From browsing to shipped in a minute." />
        <ol className="mt-12 grid grid-cols-1 gap-3 lg:grid-cols-3 [&>*]:min-w-0">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-border">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-base text-secondary [text-wrap:pretty]">{s.body}</p>
              <code className="no-scrollbar mt-6 block overflow-x-auto whitespace-nowrap rounded-lg bg-code px-3 py-2 font-mono text-sm text-secondary ring-1 ring-border">{s.code}</code>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="kinds" className="mx-auto mt-24 max-w-[1400px] px-4 sm:mt-40 sm:px-6">
        <SectionHead id="kinds" eyebrow="The library" title={`${categories.length} kinds of motion, all of it type.`} body="Grouped by what the effect does, so you can find one by the job instead of the name." />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 4) * 0.05}>
              <Link
                href={`/components#cat-${c.id}`}
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl bg-surface p-4 ring-1 ring-border transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:ring-foreground/20 active:scale-[0.98] sm:p-6"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-semibold">{c.title}</span>
                  <span className="font-mono text-sm text-tertiary tabular-nums">{catalog.filter((x) => x.category === c.id).length}</span>
                </span>
                <span className="text-sm text-secondary">{c.blurb}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ai" className="mx-auto mt-24 grid max-w-[1400px] grid-cols-1 gap-12 px-4 sm:mt-40 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center [&>*]:min-w-0">
        <div>
          <SectionHead id="ai" eyebrow="For AI agents" title="Your agent can install it, too." body="Every component has a Markdown page and a registry item. The MCP server lets Claude, Cursor or Codex search by intent, read the props and add the right effect." />
          <Link href="/docs/ai" className="group mt-6 inline-flex items-center gap-2 text-base font-semibold">
            Set up AI tools
            <ArrowRight aria-hidden className={arrow} />
          </Link>
        </div>
        <div>
          <Code lang="bash" label="Install" code={installLine} />
          <Code lang="bash" label="Connect" code={`claude mcp add --transport http textlab ${site.url}/api/mcp`} />
        </div>
      </section>

      <section aria-label="Numbers" className="mx-auto mt-24 grid max-w-[1400px] grid-cols-1 gap-12 px-4 sm:mt-40 sm:grid-cols-3 sm:px-6">
        {[
          { value: total, label: "Text effects, each with live variants" },
          { value: categories.length, label: "Groups, named by what they do" },
          { value: 363, label: "Tests, including an axe check for every component" },
        ].map((stat) => (
          <div key={stat.label} className="border-t pt-6">
            <StatReveal value={stat.value} className="font-display text-7xl leading-none tracking-tight sm:text-8xl" />
            <p className="mt-3 max-w-[24ch] text-base text-secondary">{stat.label}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="faq" className="mx-auto mt-24 grid max-w-[1400px] grid-cols-1 gap-12 px-4 sm:mt-40 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <SectionHead id="faq" eyebrow="FAQ" title="Good questions." body="Anything else is in the docs, or open an issue on GitHub." />
        <Faq />
      </section>

      {/* Final call to action, the same action as the top of the page. */}
      <section aria-labelledby="start" className="mx-auto mt-24 max-w-[1400px] px-4 pb-24 sm:mt-40 sm:px-6">
        <div className="flex flex-col items-center rounded-3xl bg-surface px-6 py-16 text-center ring-1 ring-border sm:py-24">
          <h2 id="start" className="font-display text-6xl leading-none tracking-[-0.05em] sm:text-8xl">
            Start typing.
          </h2>
          <p className="mt-6 max-w-[680px] text-lg text-secondary [text-wrap:balance]">Pick an effect, run one command, and your next headline moves the way you meant it to.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <PrimaryCta />
            <GithubStar size="lg" />
          </div>
          <p className="mt-6 text-sm text-tertiary">Free and MIT licensed. A star helps other people find it.</p>
        </div>
      </section>
    </main>
  );
}
