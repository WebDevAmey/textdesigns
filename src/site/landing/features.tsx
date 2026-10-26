import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const features = [
  {
    title: "Accessible by default",
    body: "Screen readers hear each sentence once, reduced motion gets still text, and every component passes an axe check in the test suite.",
    stat: "100",
    statLabel: "Lighthouse accessibility on this page",
  },
  {
    title: "Ready for your agent",
    body: "Every effect has a Markdown page, there is an llms.txt index, and the MCP server lets Claude, Cursor or Codex search and install by intent.",
    stat: "MCP",
    statLabel: "Server, llms.txt and Markdown docs",
  },
  {
    title: "Source in your repo",
    body: "The shadcn CLI copies each effect into your components folder as plain TypeScript. No runtime package to update, MIT licensed.",
    stat: "0",
    statLabel: "Runtime packages to install",
  },
];

/** Three plain tiles: what you get besides the motion. */
export function Features({ tests }: { tests: number }) {
  return (
    <section aria-labelledby="features-title" className="border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <SectionHead id="features-title" eyebrow="Why Textlab" title="The details are already done." body={`${tests} tests guard the library, so the effect you copy behaves the same in your app.`} />
        <ul className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 0.06} className="flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-[var(--hairline)]">
              <p className="font-display text-5xl font-semibold tracking-[-0.04em]">{f.stat}</p>
              <p className="label-mono mt-2 text-tertiary">{f.statLabel}</p>
              <h3 className="mt-10 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-base text-secondary [text-wrap:pretty]">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
