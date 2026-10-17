import { DocsShell } from "@/site/docs-shell";

export default function Layout({ children }: LayoutProps<"/guides">) {
  return <DocsShell>{children}</DocsShell>;
}
