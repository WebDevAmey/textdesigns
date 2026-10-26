export const site = {
  name: "Textlab",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://textlab.dev",
  description: "Text effects for React. Live, accessible, installed with the shadcn CLI, and readable by your AI tools.",
  github: "https://github.com/WebDevAmey/textdesigns",
  namespace: "@textlab",
};

export const registryUrl = (name: string) => `${site.url}/r/${name}.json`;

export const mainNav = [
  { href: "/components", label: "Components" },
  { href: "/docs/introduction", label: "Docs" },
  { href: "/guides", label: "Guides" },
  { href: "/docs/changelog", label: "Changelog" },
];

export const docsNav = [
  {
    title: "Get started",
    items: [
      { href: "/docs/introduction", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/tokens", label: "Tokens" },
      { href: "/docs/ai", label: "AI and MCP" },
      { href: "/docs/faq", label: "FAQ" },
      { href: "/docs/changelog", label: "Changelog" },
    ],
  },
  {
    title: "More",
    items: [
      { href: "/guides", label: "Guides" },
      { href: "/compare", label: "Compare" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
];
