import { DocsShell } from "@/site/docs-shell";

export default function Layout({ children }: LayoutProps<"/compare">) {
  return <DocsShell>{children}</DocsShell>;
}
