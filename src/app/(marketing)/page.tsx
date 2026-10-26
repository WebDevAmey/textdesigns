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
      <section aria-labelledby="faq-title" className="border-t border-[var(--hairline)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead
            id="faq-title"
            stacked
            title="Questions, answered."
            action={
              <Link href="/docs/faq" className="text-sm font-semibold underline decoration-[var(--hairline)] underline-offset-4 transition hover:decoration-current">
                All questions
              </Link>
            }
          />
          <Reveal>
            <Faq limit={5} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
