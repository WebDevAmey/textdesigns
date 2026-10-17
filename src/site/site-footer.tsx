import Link from "next/link";
import { site } from "./config";

const groups = [
  {
    title: "Library",
    links: [
      { href: "/components", label: "Components" },
      { href: "/guides", label: "Guides" },
      { href: "/compare", label: "Compare" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/docs/changelog", label: "Changelog" },
    ],
  },
  {
    title: "AI",
    links: [
      { href: "/docs/ai", label: "AI docs" },
      { href: "/llms.txt", label: "llms.txt" },
      { href: "/docs/ai#mcp", label: "MCP" },
      { href: "/r/registry.json", label: "Registry" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: site.github, label: "GitHub" },
      { href: "/docs/installation", label: "Installation" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <p className="font-display text-2xl italic">Textlab</p>
          <p className="mt-2 text-sm text-secondary">Text effects for React, with docs your AI tools can read.</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-medium">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-secondary transition-colors duration-150 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-[1400px] px-4 pb-10 text-xs text-tertiary sm:px-6">MIT licensed. Built with motion and React.</div>
    </footer>
  );
}
