"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const section = href.split("/")[1];
  const active = pathname === href || (section && pathname.startsWith(`/${section}`));
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="shrink-0 rounded-md px-2 py-1.5 text-sm text-secondary transition-colors duration-150 hover:text-foreground aria-[current=page]:text-foreground"
    >
      {children}
    </Link>
  );
}
