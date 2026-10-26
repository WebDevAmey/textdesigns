import { catalog } from "@registry/catalog";
import { GithubStar } from "@/site/github-star";
import { CinematicFooter } from "@/site/landing/cinematic-footer";
import { SmoothScroll } from "@/site/landing/smooth-scroll";

/**
 * The landing page scrolls over its footer like a curtain: main is opaque and lifted above, and the
 * footer is fixed underneath, revealed as the last section scrolls away.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <div className="relative z-10 border-b border-[var(--hairline)] bg-background">{children}</div>
      <CinematicFooter total={catalog.length} star={<GithubStar size="lg" />} />
    </>
  );
}
