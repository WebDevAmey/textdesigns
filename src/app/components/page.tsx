import Link from "next/link";
import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";

export const metadata = { title: "Components", description: "Every Textlab text effect, grouped by what it does." };

export default function ComponentsIndex() {
  return (
    <div className="max-w-[960px]">
      <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">Components</h1>
      <p className="mt-2 text-lg text-secondary">{catalog.length} text effects, each live on its page and installable with one command.</p>
      {categories.map((category) => {
        const items = catalog.filter((c) => c.category === category.id);
        if (!items.length) return null;
        return (
          <section key={category.id} aria-labelledby={`cat-${category.id}`} className="mt-12">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 id={`cat-${category.id}`} className="font-display text-[28px] leading-tight">{category.title}</h2>
              <p className="text-sm text-tertiary">{category.blurb}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <li key={item.name} className={i < 6 ? "tl-stagger" : undefined} style={i < 6 ? { animationDelay: `${i * 40}ms` } : undefined}>
                  <Link href={`/components/${item.name}`} className="block h-full rounded-xl border p-4 transition-[border-color,transform] duration-150 hover:border-foreground/25 active:scale-[0.99]">
                    <span className="font-medium">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-secondary">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
