import { catalog } from "@registry/catalog";
import { GithubStar } from "@/site/github-star";
import { LandingFooter } from "@/site/landing/landing-footer";
import { SmoothScroll } from "@/site/landing/smooth-scroll";

/** The landing page ends on a cloud call to action whose rounded bottom sits over the dark footer. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <div className="relative z-10 bg-background">{children}</div>
      <LandingFooter total={catalog.length} star={<GithubStar size="lg" />} />
    </>
  );
}
