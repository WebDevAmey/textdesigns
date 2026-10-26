import { site } from "./config";

const repo = site.github.replace("https://github.com/", "");

/** Star count from the GitHub API, refreshed hourly. Null when the API is unreachable or rate limited. */
async function stars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { next: { revalidate: 3600 }, headers: { accept: "application/vnd.github+json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

const compact = (n: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 .9l2.1 4.4 4.8.6-3.5 3.3.9 4.8L8 11.7l-4.3 2.3.9-4.8L1.1 5.9l4.8-.6z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/** Link to the repository with its live star count: the quickest way to support the project. */
export async function GithubStar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const count = await stars();
  // Names come from the visible text plus screen-reader-only words, so what people see is what they hear.
  const suffix = count === null ? null : <span className="sr-only"> stars</span>;
  if (size === "lg") {
    return (
      <a
        href={site.github}
        className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-surface-2 pl-4 pr-5 text-[15px] font-medium transition-transform duration-150 active:scale-[0.97]"
      >
        <StarIcon className="size-4 text-accent transition-transform duration-300 group-hover:rotate-[72deg]" />
        Star on GitHub
        {count !== null && <span className="font-mono text-[13px] text-secondary tabular-nums">{compact(count)}</span>}
        {suffix}
      </a>
    );
  }
  return (
    <a
      href={site.github}
      className="group inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-2 pl-2.5 pr-3 text-[13px] font-medium text-secondary transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.97] pointer-coarse:h-11"
    >
      <GithubIcon className="size-3.5" />
      <span className="sr-only sm:not-sr-only">Star</span>
      <span className="sr-only"> on GitHub</span>
      <StarIcon className="size-3 text-accent transition-transform duration-300 group-hover:rotate-[72deg] sm:hidden" />
      {count !== null && <span className="font-mono text-[12px] tabular-nums">{compact(count)}</span>}
      {suffix}
    </a>
  );
}
