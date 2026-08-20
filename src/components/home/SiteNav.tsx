"use client";

import DocsNav from "@/components/animations/DocsNav";
import { docGroups } from "@/lib/animations-docs";

export default function SiteNav() {
  return <DocsNav groups={docGroups} onSelect={() => {}} />;
}