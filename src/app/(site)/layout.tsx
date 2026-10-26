import { SiteFooter } from "@/site/site-footer";

/** Docs, components and guides share the plain link footer; the landing page has its own. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
