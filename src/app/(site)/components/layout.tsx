import { DocsShell } from "@/site/docs-shell";

export default function ComponentsLayout({ children }: LayoutProps<"/components">) {
  return <DocsShell>{children}</DocsShell>;
}
