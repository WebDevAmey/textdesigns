import Link from "next/link";
import { catalog } from "@registry/catalog";

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <section className="py-24 sm:py-32">
        <h1 className="max-w-4xl font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.03em]">Text effects your users feel and your agents can install.</h1>
        <p className="mt-6 max-w-xl text-lg text-secondary">
          {catalog.length} live text components for React. Copy the source with the shadcn CLI, read every page as Markdown, or let your AI tool find them over MCP.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/components" className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform duration-150 active:scale-[0.97]">Explore components</Link>
          <Link href="/docs/ai" className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-[border-color,transform] duration-150 hover:border-foreground/25 active:scale-[0.97]">Give Textlab to your AI</Link>
        </div>
      </section>
    </main>
  );
}
