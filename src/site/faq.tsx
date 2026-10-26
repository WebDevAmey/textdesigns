import { Plus } from "lucide-react";

export const faqs = [
  {
    q: "Is Textlab free for commercial projects?",
    a: "Yes. Everything is MIT licensed, so you can use it in client work and products you sell. Keep the license notice in copies of the source.",
  },
  {
    q: "How do I add an effect?",
    a: "Open its page and run the shadcn command, for example npx shadcn@latest add @textlab/blur-reveal. The file lands in your components folder with its shared helpers, so there is no package to keep updated.",
  },
  {
    q: "What does my project need?",
    a: "React 19, Tailwind CSS 4 and Motion 12. A few effects use canvas or SVG filters and need nothing else. Each page lists exactly what it installs.",
  },
  {
    q: "Will it work with my AI coding tool?",
    a: "Yes. Every effect has a Markdown page, there is an llms.txt index, and the MCP server lets Claude, Cursor or Codex search by intent and install the right component.",
  },
  {
    q: "What about people who prefer less motion?",
    a: "Every effect checks the reduced motion setting and falls back to still, readable text. Screen readers hear the sentence once, never letter by letter.",
  },
  {
    q: "Can I change how an effect looks or moves?",
    a: "The source lives in your project, so you can edit anything. Most effects also take duration, easing and variant props, and they read your theme tokens for color.",
  },
  {
    q: "Will it slow my page down?",
    a: "Effects only animate transform, opacity and filter, pause when they scroll out of view, and load nothing until they are used. Text stays real HTML, so it still counts for search and LCP.",
  },
];

/** Plain question and answer pairs: native disclosure for the UI, FAQ schema for search engines. */
export function Faq({ limit }: { limit?: number } = {}) {
  const shown = limit ? faqs.slice(0, limit) : faqs;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: shown.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="divide-y divide-border border-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {shown.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium transition-colors duration-200 hover:text-accent [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus aria-hidden className="size-5 shrink-0 text-tertiary transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45" strokeWidth={1.75} />
          </summary>
          <p className="tl-disclosure-panel max-w-2xl pb-6 text-base text-secondary [text-wrap:pretty]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
