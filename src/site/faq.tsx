import { FaqAccordion } from "./faq-accordion";

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

/** Smooth single-open accordion for people, FAQ schema for search engines. */
export function Faq({ limit }: { limit?: number } = {}) {
  const shown = limit ? faqs.slice(0, limit) : faqs;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: shown.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <FaqAccordion items={shown} />
    </>
  );
}
