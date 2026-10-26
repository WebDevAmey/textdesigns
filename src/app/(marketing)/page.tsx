import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { site } from "@/site/config";
import { Details } from "@/site/landing/details";
import { Hero } from "@/site/landing/hero";
import { Install } from "@/site/landing/install";
import { Stage } from "@/site/landing/stage";

const total = catalog.length;
const variants = catalog.reduce((n, c) => n + c.variants.length, 0);
const install = `npx shadcn@latest add ${site.namespace}/blur-reveal`;

// Kept in step with the test suite: 363 tests, including an axe check for every component.
const TESTS = 363;

export default function Home() {
  return (
    <main id="main">
      <Hero install={install} stack={["React 19", "Next.js", "Tailwind 4", "Motion", "shadcn/ui"]} />
      <Stage total={total} />
      <Install install={install} mcp={`claude mcp add --transport http textlab ${site.url}/api/mcp`} file="components/textlab/blur-reveal/blur-reveal.tsx" />
      <Details
        stats={[
          { value: total, label: "Effects" },
          { value: categories.length, label: "Groups" },
          { value: variants, label: "Variants" },
          { value: TESTS, label: "Tests" },
        ]}
      />
    </main>
  );
}
