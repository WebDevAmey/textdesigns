import Link from "next/link";
import { DocPage } from "@/site/doc-page";
import { guides } from "@/site/guides";

export const metadata = { title: "Guides", description: "Step-by-step builds with Textlab components." };

export default function Guides() {
  return (
    <DocPage title="Guides" lead="Step-by-step builds with Textlab: where each effect fits, and how to keep it readable.">
      <ul className="not-prose mt-2 grid list-none gap-3 p-0">
        {guides.map((g) => (
          <li key={g.slug} className="m-0">
            <Link href={`/guides/${g.slug}`} className="block rounded-xl border p-4 no-underline transition-[border-color,transform] duration-150 hover:border-foreground/25 active:scale-[0.99]">
              <span className="block font-medium text-foreground">{g.title}</span>
              <span className="mt-0.5 block text-sm text-secondary">{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </DocPage>
  );
}
