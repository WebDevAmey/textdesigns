import Link from "next/link";
import { catalog } from "@registry/catalog";
import { site } from "@/site/config";
import { Faq } from "@/site/faq";
import { EffectsGrid } from "@/site/landing/effects-grid";
import { Features } from "@/site/landing/features";
import { Hero } from "@/site/landing/hero";
import { Install } from "@/site/landing/install";
import { Reveal } from "@/site/landing/reveal";
import { SectionHead } from "@/site/landing/section-head";
import { StackStrip } from "@/site/landing/stack-strip";

const total = catalog.length;
const install = `npx shadcn@latest add ${site.namespace}/blur-reveal`;

// Kept in step with the test suite: 363 tests, including an axe check for every component.
const TESTS = 363;

export default function Home() {
  return (
    <main id="main">
      <Hero install={install} total={total} />
      <StackStrip />
      <EffectsGrid total={total} />
      <Install install={install} mcp={`claude mcp add --transport http textlab ${site.url}/api/mcp`} file="components/textlab/blur-reveal/blur-reveal.tsx" />
      <Features tests={TESTS} />
      <section aria-labelledby="faq-title" className="bg-surface">
        <div className="mx-auto max-w-[834px] px-4 py-20 md:py-28">
          <div aria-hidden className="mb-14 border-t-2 border-dotted border-black/15 dark:border-white/15" />
          <SectionHead id="faq-title" eyebrow="FAQ" title="Frequently asked questions" body="What to know about licensing, installing and using Textlab." />
          <Reveal className="mt-12">
            <Faq limit={6} />
          </Reveal>
          <p className="mt-8 text-center text-sm text-secondary">
            More in the{" "}
            <Link href="/docs/faq" className="font-medium text-foreground underline decoration-[var(--hairline)] underline-offset-4 transition hover:decoration-current">
              full FAQ
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
