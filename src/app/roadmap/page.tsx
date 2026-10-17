import { DocPage } from "@/site/doc-page";

export const metadata = { title: "Roadmap", description: "What is next for Textlab." };

const lanes = [
  { title: "Next", items: ["A playground export to a shareable link", "Font pairing presets for each component", "Copy for AI on every page", "Per-component Lighthouse budgets in CI"] },
  { title: "Later", items: ["Audio-reactive kinetic type", "Text on a 3D path with WebGPU", "A Figma plugin that previews effects on real frames", "Vue and Svelte ports of the CSS-only effects"] },
  { title: "Exploring", items: ["Variable-font morphing between two typefaces", "Handwriting from recorded pen strokes", "Collaborative cursor-trail presence"] },
];

export default function Roadmap() {
  return (
    <DocPage title="Roadmap" lead="What we are building next. Plans change; the changelog is the record of what shipped.">
      {lanes.map((lane) => (
        <section key={lane.title}>
          <h2>{lane.title}</h2>
          <ul>
            {lane.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </DocPage>
  );
}
