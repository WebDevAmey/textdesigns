import { DocsShell } from "@/site/docs-shell";

export default function Layout({ children }: LayoutProps<"/roadmap">) {
  return <DocsShell>{children}</DocsShell>;
}
