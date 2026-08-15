"use client";

import { memo, useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DocGroup, DocIcon } from "@/lib/animations-docs";

const ICONS: Record<DocIcon, React.ReactNode> = {
  type: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7V5h16v2" />
      <path d="M12 5v14" />
      <path d="M9 19h6" />
    </svg>
  ),
  reveal: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  hover: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l7.1 17 2.2-7.1 7.1-2.2z" />
    </svg>
  ),
  loop: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </svg>
  ),
  scroll: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="2" width="8" height="20" rx="4" />
      <path d="M12 6v4" />
    </svg>
  ),
};

interface DocsSidebarProps {
  groups: DocGroup[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  className?: string;
}

const SidebarItem = memo(function SidebarItem({
  href,
  name,
  isActive,
  isHovered,
  onHover,
  onSelect,
}: {
  href: string;
  name: string;
  isActive: boolean;
  isHovered: boolean;
  onHover: (href: string) => void;
  onSelect: () => void;
}) {
  return (
    <div onMouseEnter={() => onHover(href)} className="relative">
      {isActive && <div className="absolute inset-0 z-0 rounded-md bg-secondary" />}
      {isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 z-0 rounded-md bg-secondary/60"
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 35,
          }}
        />
      )}
      <Link
        href={href}
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative z-10 flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors",
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <motion.span
          className="truncate"
          style={{ transformOrigin: "left center" }}
          animate={isHovered ? { scale: 1.07 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {name}
        </motion.span>
      </Link>
    </div>
  );
});

function SidebarGroup({
  group,
  activeSlug,
  hoveredPath,
  onHover,
  onSelect,
}: {
  group: DocGroup;
  activeSlug: string;
  hoveredPath: string | null;
  onHover: (href: string) => void;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {ICONS[group.icon]}
        {group.label}
      </div>

      <div className="mt-1 ml-4 flex flex-col space-y-0.5 border-l border-border pl-2">
        {group.docs.map((doc) => (
          <SidebarItem
            key={doc.slug}
            href={`#${doc.slug}`}
            name={doc.name}
            isActive={doc.slug === activeSlug}
            isHovered={hoveredPath === `#${doc.slug}`}
            onHover={onHover}
            onSelect={() => onSelect(doc.slug)}
          />
        ))}
      </div>
    </div>
  );
}

export default function DocsSidebar({ groups, activeSlug, onSelect, className }: DocsSidebarProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const handleHover = useCallback((href: string) => {
    setHoveredPath(href);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPath(null);
  }, []);

  return (
    <nav
      aria-label="Animation documentation"
      className={cn("-ml-2 flex min-h-full w-full flex-col", className)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="my-auto w-full space-y-6 pb-8">
        {groups.map((group) => (
          <SidebarGroup
            key={group.label}
            group={group}
            activeSlug={activeSlug}
            hoveredPath={hoveredPath}
            onHover={handleHover}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}