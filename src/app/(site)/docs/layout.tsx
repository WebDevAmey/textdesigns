import { DocsShell } from "@/site/docs-shell";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return <DocsShell>{children}</DocsShell>;
}
