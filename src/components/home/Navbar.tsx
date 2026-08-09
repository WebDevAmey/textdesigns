"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          TextLab
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-sm">
          <Link
            href="/animations"
            className="transition-opacity duration-200 hover:opacity-60"
          >
            Animations
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-200 hover:opacity-60"
          >
            GitHub
          </a>

          <Link
            href="/animations"
            className="rounded-full border px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Explore
          </Link>
        </div>
      </nav>
    </header>
  );
}