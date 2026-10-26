import Link from "next/link";
import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { DocPage } from "@/site/doc-page";

export const metadata = { title: "Introduction", description: "What Textlab is, how it is built, and how to use it." };

export default function Introduction() {
  return (
    <DocPage title="Introduction" lead="Textlab is a library of text effects for React. Every component does one thing to type, installs as source you own, and has docs your AI tools can read.">
      <h2>What you get</h2>
      <ul>
        <li>
          <strong>{catalog.length} components</strong> across {categories.length} groups: reveals, numbers, typing, light, filters, scroll, drawing, cursor, physics, paths, pixels and kinetic type.
        </li>
        <li>
          <strong>Live examples.</strong> Every page runs the real component. Nothing is a recording.
        </li>
        <li>
          <strong>Source in your project.</strong> The shadcn CLI copies each component into <code>components/textlab</code>. Change anything.
        </li>
        <li>
          <strong>Built-in accessibility.</strong> Split text keeps one copy for screen readers, every effect has a reduced-motion branch, and nothing shifts layout.
        </li>
        <li>
          <strong>Agent-ready.</strong> A Markdown page per component, <Link href="/llms.txt">llms.txt</Link>, a registry and an <Link href="/docs/ai">MCP server</Link>.
        </li>
      </ul>

      <h2>How it is built</h2>
      <p>
        Components are React and TypeScript with <code>motion</code> for animation, plain CSS for anything that can run without JavaScript, and canvas or WebGL only where the effect needs pixels. Shared utilities ship as one registry item, <code>text-fx</code>, and the tokens as another, <code>text-fx-tokens</code>.
      </p>
      <p>Every component speaks the same props:</p>
      <ul>
        <li>
          <code>text</code>, <code>as</code> and <code>variant</code> say what to render and how it looks.
        </li>
        <li>
          <code>trigger</code> chooses when it starts: on mount, in view, on hover, or when you set <code>active</code>.
        </li>
        <li>
          <code>delay</code>, <code>stagger</code>, <code>duration</code> and <code>ease</code> tune timing with the same units everywhere.
        </li>
        <li>
          <code>reducedMotion</code> follows the OS setting by default, or can be forced on or off.
        </li>
      </ul>

      <h2>Choosing a component</h2>
      <p>Components are named by their job. A few starting points:</p>
      <ul>
        <li>
          A section title that animates as it scrolls in: <Link href="/components/in-view-title">In-view title</Link>.
        </li>
        <li>
          A number that changes in front of people: <Link href="/components/rolling-number">Rolling number</Link>.
        </li>
        <li>
          A label that changes state: <Link href="/components/text-morph">Text morph</Link>.
        </li>
        <li>
          A paragraph people should actually read: <Link href="/components/scroll-fill">Scroll fill</Link>.
        </li>
      </ul>
      <p>
        Ready to add one? Start with <Link href="/docs/installation">installation</Link>.
      </p>
    </DocPage>
  );
}
