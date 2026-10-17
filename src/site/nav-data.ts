import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { docsNav } from "./config";
import type { SidebarGroup } from "./sidebar";

export function sidebarGroups(): SidebarGroup[] {
  const componentGroups = categories
    .map((category) => ({
      title: category.title,
      items: catalog.filter((c) => c.category === category.id).map((c) => ({ href: `/components/${c.name}`, label: c.title, badge: c.heavy ? "GL" : undefined })),
    }))
    .filter((group) => group.items.length);
  return [...docsNav, { title: "Overview", items: [{ href: "/components", label: "All components" }] }, ...componentGroups];
}
