import { byName, catalog } from "@registry/catalog";
import { componentMarkdown } from "@/site/markdown";
import { componentFiles } from "@/site/source";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map((entry) => ({ slug: entry.name }));
}

export async function GET(_request: Request, { params }: RouteContext<"/components/[slug]/markdown">) {
  const { slug } = await params;
  const meta = byName(slug);
  if (!meta) return new Response("Not found", { status: 404 });
  const body = componentMarkdown(meta, await componentFiles(meta));
  return new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
