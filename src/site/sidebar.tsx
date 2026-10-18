"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarGroup {
  title: string;
  items: { href: string; label: string; badge?: string }[];
}

export function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" className="space-y-7 text-sm">
      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="mb-1.5 px-2 text-xs font-medium text-tertiary">{group.title}</h2>
          <ul>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center justify-between rounded-md px-2 py-1 text-secondary pointer-coarse:py-2.5 transition-colors duration-150 hover:text-foreground aria-[current=page]:bg-surface-2 aria-[current=page]:text-foreground"
                  >
                    {item.label}
                    {item.badge ? <span className="text-[10px] text-tertiary">{item.badge}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
