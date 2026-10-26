import pkg from "../../../package.json";

const major = (range: string) => range.replace(/^[^\d]*/, "").split(".").slice(0, 2).join(".");

const stack = [
  { name: "React", version: major(pkg.dependencies.react) },
  { name: "Next.js", version: major(pkg.dependencies.next) },
  { name: "Tailwind CSS", version: "4" },
  { name: "Motion", version: major(pkg.dependencies.motion) },
  { name: "shadcn CLI", version: major(pkg.dependencies.shadcn) },
  { name: "TypeScript", version: "5" },
];

/** The stack, with versions read from package.json so they never go stale. */
export function StackStrip() {
  return (
    <section aria-label="Built with" className="border-b border-[var(--hairline)]">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-8 md:px-8">
        {stack.map((s) => (
          <li key={s.name} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-[var(--hairline)]">
            <span className="font-medium">{s.name}</span>
            <span className="font-mono text-xs text-tertiary">v{s.version}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
