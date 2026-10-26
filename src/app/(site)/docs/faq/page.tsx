import { DocPage } from "@/site/doc-page";
import { Faq } from "@/site/faq";

export const metadata = { title: "FAQ", description: "Licensing, installation, requirements, AI tools, accessibility and performance." };

export default function FaqPage() {
  return (
    <DocPage title="FAQ" lead="The questions people ask before adding their first effect.">
      <div className="not-prose mt-6">
        <Faq />
      </div>
    </DocPage>
  );
}
