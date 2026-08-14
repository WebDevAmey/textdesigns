"use client";

import { memo, useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TYPE_ICON = (
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
);

interface DocsSidebarProps {
  docs: Array<{ slug: string; name: string }>;
  activeSlug: string;
  className?: string;
}

const SidebarItem = memo(function SidebarItem({
  href,
  name,
  isActive,
  isHovered,
  onHover,
}: {
  href: string;
  name: string;
  isActive: boolean;
  isHovered: boolean;
  onHover: (href: string) => void;
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
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative z-10 flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors",
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="truncate">{name}</span>
      </Link>
    </div>
  );
});

export default function DocsSidebar({ docs, activeSlug, className }: DocsSidebarProps) {
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
      className={cn("w-full space-y-6 pb-8", className)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {TYPE_ICON}
          Text Animations
        </div>
        <div className="mt-1 ml-4 flex flex-col space-y-0.5 border-l border-border pl-2">
          {docs.map((doc, i) => (
            <SidebarItem
              key={doc.slug}
              href={`#${doc.slug}`}
              name={`${String(i + 1).padStart(2, "0")} ${doc.name}`}
              isActive={doc.slug === activeSlug}
              isHovered={hoveredPath === `#${doc.slug}`}
              onHover={handleHover}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}