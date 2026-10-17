import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { sidebarGroups } from "./nav-data";

/** Sidebar plus content column, shared by docs and component pages. */
export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1400px] gap-10 px-4 sm:px-6">
      <aside className="sticky top-(--header-h) hidden h-[calc(100dvh-var(--header-h))] w-56 shrink-0 overflow-y-auto py-8 no-scrollbar lg:block">
        <Sidebar groups={sidebarGroups()} />
      </aside>
      <main id="main" className="min-w-0 flex-1 py-8 lg:py-12">
        <details className="group mb-8 rounded-xl border lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
            Browse
            <span aria-hidden className="text-secondary transition-transform duration-200 ease-enter group-open:rotate-45">+</span>
          </summary>
          <div className="tl-disclosure-panel max-h-[60dvh] overflow-y-auto border-t px-2 py-4">
            <Sidebar groups={sidebarGroups()} />
          </div>
        </details>
        {children}
      </main>
    </div>
  );
}
