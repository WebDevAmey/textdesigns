"use client";

import { memo, useCallback, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DocGroup, DocIcon } from "@/lib/animations-docs";

const ICONS: Record<DocIcon, React.ReactNode> = {
  type: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V5h16v2" />
      <path d="M12 5v14" />
      <path d="M9 19h6" />
    </svg>
  ),
  reveal: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  hover: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l7.1 17 2.2-7.1 7.1-2.2z" />
    </svg>
  ),
  loop: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </svg>
  ),
  scroll: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
  const active = isActive || isHovered;

  return (
    <div
      className="relative"
      onMouseEnter={() => onHover(href)}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="vengeance-sidebar-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.5,
            }}
            className="absolute inset-0 rounded-md bg-neutral-100"
          />
        )}
      </AnimatePresence>

      <Link
        href={href}
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative z-10 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-base transition-colors",
          "text-neutral-500 hover:text-neutral-900"
        )}
      >
        <span className="truncate">{name}</span>
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
      <div className="flex items-center gap-2.5 rounded-md px-2 py-2 text-base font-semibold text-neutral-700">
        <span className="flex items-center">{ICONS[group.icon]}</span>
        <span>{group.label}</span>
      </div>

      <div className="relative ml-4 flex flex-col border-l border-neutral-200 pl-2 space-y-0.5">
        {group.docs.map((doc) => {
          const href = `#${doc.slug}`;

          return (
            <SidebarItem
              key={doc.slug}
              href={href}
              name={doc.name}
              isActive={doc.slug === activeSlug}
              isHovered={hoveredPath === href}
              onHover={onHover}
              onSelect={() => onSelect(doc.slug)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function DocsSidebar({
  groups,
  activeSlug,
  onSelect,
  className,
}: DocsSidebarProps) {
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
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex min-h-full w-full flex-col",
        className
      )}
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
