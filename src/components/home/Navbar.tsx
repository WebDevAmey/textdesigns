"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Animations", link: "/animations" },
  { name: "About", link: "#about" },
];

export default function NavbarComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar className="top-0">
      {/* Desktop Navigation */}
      <NavBody>
        <Link href="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-black text-white dark:bg-white dark:text-black">
            T
          </div>
          <span className="text-sm font-semibold text-black dark:text-white">
            TextLab
          </span>
        </Link>

        <NavItems items={navItems} />

        <div className="flex items-center gap-4">
          
          <NavbarButton variant="dark">Explore</NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link href="/" className="flex items-center space-x-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-black text-white dark:bg-white dark:text-black">
              T
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              TextLab
            </span>
          </Link>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="dark"
              className="w-full"
            >
              Explore
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}