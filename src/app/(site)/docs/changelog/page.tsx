import Link from "next/link";
import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { DocPage } from "@/site/doc-page";

export const metadata = { title: "Changelog", description: "Every Textlab release: new components and improvements to the docs, registry and AI tooling." };

export default function Changelog() {
  const byDate = Object.entries(
    catalog.reduce<Record<string, typeof catalog>>((acc, item) => {
      (acc[item.added] ??= []).push(item);
      return acc;
    }, {}),
  ).sort(([a], [b]) => b.localeCompare(a));

  return (
    <DocPage title="Changelog" lead="New components, and the improvements around them.">
      <h2>October 2026: the rebuild</h2>
      <p>
        Textlab was rebuilt from the ground up: a shadcn registry, a Markdown page per component, llms.txt, an MCP server, shared motion tokens, screen-reader text for every split effect and a reduced-motion branch for every component.
      </p>
      {byDate.map(([date, items]) => (
        <section key={date}>
          <h3>
            {new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {items.length} components
          </h3>
          <ul>
            {categories
              .filter((c) => items.some((i) => i.category === c.id))
              .map((c) => (
                <li key={c.id}>
                  <strong>{c.title}:</strong>{" "}
                  {items
                    .filter((i) => i.category === c.id)
                    .map((i, n, all) => (
                      <span key={i.name}>
                        <Link href={`/components/${i.name}`}>{i.title}</Link>
                        {n < all.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </DocPage>
  );
}
