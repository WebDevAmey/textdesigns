import Link from "next/link";
import { notFound } from "next/navigation";
import { byName, catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { site } from "@/site/config";
import { highlight } from "@/site/highlight";
import { componentFiles, demoSource } from "@/site/source";
import { Preview } from "@/site/preview";
import { Tabs } from "@/site/tabs";
import { CodeView } from "@/site/code-view";
import { InstallCommand } from "@/site/install-command";
import { PropsTable } from "@/site/props-table";
import { CopyButton } from "@/site/copy-button";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map((entry) => ({ slug: entry.name }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const meta = byName(slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: `${meta.description} A React text effect you install with the shadcn CLI.`,
    alternates: { types: { "text/markdown": `/components/${meta.name}.md` } },
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="mb-4 font-display text-[28px] leading-tight tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5 text-[15px] text-secondary">
    {items.map((item) => (
      <li key={item} className="flex gap-2.5">
        <span aria-hidden className="mt-[0.7em] size-1 shrink-0 rounded-full bg-tertiary" />
        {item}
      </li>
    ))}
  </ul>
);

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const meta = byName(slug);
  if (!meta) notFound();

  const files = await componentFiles(meta);
  const demo = await demoSource(meta.name);
  const usage = `import { ${meta.exportName} } from "@/components/textlab/${meta.name}/${meta.name}";\n\n${meta.usage}`;
  const codeFiles = await Promise.all([
    ...(demo ? [{ label: "demo.tsx", raw: demo }] : [{ label: "usage.tsx", raw: usage }]),
    ...files.map((f) => ({ label: f.path.split("/").pop()!, raw: f.code })),
  ].map(async (f) => ({ ...f, html: await highlight(f.raw) })));
  const usageHtml = await highlight(usage);

  const category = categories.find((c) => c.id === meta.category);
  const index = catalog.indexOf(meta);
  const prev = catalog[index - 1];
  const next = catalog[index + 1];
  const related = (meta.related ?? []).map(byName).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const markdownUrl = `/components/${meta.name}.md`;

  return (
    <article className="max-w-[860px]">
      <header>
        <p className="text-sm text-secondary">
          <Link href="/components" className="transition-colors duration-150 hover:text-foreground">Components</Link>
          <span aria-hidden className="mx-1.5 text-tertiary">/</span>
          {category?.title}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">{meta.title}</h1>
            <p className="mt-2 text-lg text-secondary">{meta.description}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border px-1 py-0.5 text-[13px] text-secondary">
            <a href={markdownUrl} className="rounded-md px-2 py-1 transition-colors duration-150 hover:text-foreground">Markdown</a>
            <CopyButton value={`${site.url}${markdownUrl}`} label="Copy Markdown link" />
          </div>
        </div>
      </header>

      <div className="mt-8">
        <Tabs
          tabs={[
            { id: "preview", label: "Preview", content: <Preview name={meta.name} variants={meta.variants} preset={meta.preset} scroll={meta.scroll} /> },
            { id: "code", label: "Code", content: <CodeView files={codeFiles} /> },
          ]}
        />
      </div>

      <Section id="install" title="Installation">
        <InstallCommand target={`${site.namespace}/${meta.name}`} />
        <p className="mt-3 text-sm text-secondary">
          Needs <code className="font-mono text-[13px] text-foreground">{site.namespace}</code> in your <code className="font-mono text-[13px] text-foreground">components.json</code>.{" "}
          <Link href="/docs/installation" className="underline decoration-border underline-offset-[3px] transition-colors duration-150 hover:decoration-current">Setup takes a minute</Link>.
        </p>
      </Section>

      <Section id="usage" title="Usage">
        <CodeView files={[{ label: "usage.tsx", raw: usage, html: usageHtml }]} />
      </Section>

      <Section id="variants" title="Variants">
        <div className="flex flex-wrap gap-2">
          {meta.variants.map((v) => (
            <code key={v} className="rounded-md border bg-surface px-2 py-1 font-mono text-[13px]">{v}</code>
          ))}
        </div>
      </Section>

      <Section id="props" title="Props">
        <PropsTable props={meta.props} />
      </Section>

      <Section id="when" title="When to use it">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Reach for it</h3>
            <Bullets items={meta.whenToUse} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Skip it</h3>
            <Bullets items={meta.whenNotToUse} />
          </div>
        </div>
      </Section>

      <Section id="a11y" title="Accessibility and motion">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Accessibility</h3>
            <Bullets items={meta.accessibility} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Motion</h3>
            <Bullets items={meta.motion} />
          </div>
        </div>
        <div className="mt-6 rounded-xl border bg-surface px-4 py-3.5 text-[15px]">
          <span className="font-medium">Reduced motion.</span> <span className="text-secondary">{meta.reducedMotion}</span>
        </div>
      </Section>

      <Section id="performance" title="Performance">
        <Bullets items={meta.performance} />
      </Section>

      {related.length ? (
        <Section id="related" title="Related">
          <ul className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.name}>
                <Link href={`/components/${r.name}`} className="block rounded-xl border p-4 transition-[border-color,transform] duration-150 hover:border-foreground/25 active:scale-[0.99]">
                  <span className="font-medium">{r.title}</span>
                  <span className="mt-0.5 block text-sm text-secondary">{r.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <nav aria-label="Pagination" className="mt-16 flex justify-between gap-4 border-t pt-6 text-sm">
        {prev ? <Link href={`/components/${prev.name}`} className="text-secondary transition-colors duration-150 hover:text-foreground">← {prev.title}</Link> : <span />}
        {next ? <Link href={`/components/${next.name}`} className="text-secondary transition-colors duration-150 hover:text-foreground">{next.title} →</Link> : <span />}
      </nav>
    </article>
  );
}
