import { notFound } from "next/navigation";
import { DocPage } from "@/site/doc-page";
import { guides } from "@/site/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  return guide ? { title: guide.title, description: guide.description } : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();
  return (
    <DocPage title={guide.title} lead={guide.description}>
      {guide.body()}
    </DocPage>
  );
}
