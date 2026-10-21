import Link from "next/link";
import { mainNav } from "./config";
import { ThemeToggle } from "./theme-toggle";
import { NavLink } from "./nav-link";
import { GithubStar } from "./github-star";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-(--header-h) border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-1.5 text-foreground" aria-label="Textlab home">
          <span className="font-display text-[20px] font-semibold leading-none tracking-[-0.04em]">Textlab</span>
        </Link>
        <nav aria-label="Main" className="no-scrollbar -mx-2 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {mainNav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <GithubStar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
