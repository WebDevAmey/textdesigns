import Link from "next/link";
import { site } from "@/site/config";
import { Code, DocPage } from "@/site/doc-page";

export const metadata = { title: "Installation", description: "Add Textlab components to a React project with the shadcn CLI." };

export default function Installation() {
  return (
    <DocPage title="Installation" lead="Textlab components install with the shadcn CLI into any React project with Tailwind. Each one brings its shared utilities and tokens along.">
      <h2>1. Set up shadcn</h2>
      <p>Skip this if your project already has a <code>components.json</code>.</p>
      <Code lang="bash" code={`npx shadcn@latest init`} />

      <h2>2. Register the namespace</h2>
      <p>Add Textlab to the registries in <code>components.json</code> so you can install by name.</p>
      <Code lang="json" label="components.json" code={`{\n  "registries": {\n    "${site.namespace}": "${site.url}/r/{name}.json"\n  }\n}`} />

      <h2>3. Add a component</h2>
      <Code lang="bash" code={`npx shadcn@latest add ${site.namespace}/in-view-title`} />
      <p>Without the namespace, use the full URL:</p>
      <Code lang="bash" code={`npx shadcn@latest add ${site.url}/r/in-view-title.json`} />
      <p>
        Files land in <code>components/textlab/</code> (or <code>src/components/textlab/</code>). The shared utilities go to <code>components/textlab/lib</code> and components import them with relative paths, so no <code>tsconfig</code> change is needed.
      </p>

      <h2>4. Import the tokens once</h2>
      <Code lang="tsx" label="app/layout.tsx" code={`import "@/components/textlab/tokens.css";`} />
      <p>
        The tokens define color, type and motion variables, light and dark themes, and the no-script and reduced-motion fallbacks. Dark mode follows a <code>.dark</code> class or <code>data-theme=&quot;dark&quot;</code> on <code>&lt;html&gt;</code>.
      </p>

      <h2>5. Use it</h2>
      <Code
        lang="tsx"
        code={`import { InViewTitle } from "@/components/textlab/in-view-title/in-view-title";\n\nexport function Features() {\n  return <InViewTitle variant="words" text="Everything your team needs" />;\n}`}
      />

      <h2>Fonts</h2>
      <p>
        Most effects use whatever font they inherit. A few read optional font tokens: variable-font effects use <code>--font-flex</code> (Roboto Flex works well), and <Link href="/components/signature">Signature</Link> uses <code>--font-script</code>. Load them with <code>next/font</code> and set the CSS variables.
      </p>

      <h2>Manual install</h2>
      <p>
        Every registry item is plain JSON with the source inlined. Open any <code>/r/&lt;name&gt;.json</code>, copy the files into the same folders, and run <code>npm install motion@12</code> when a component lists it.
      </p>
    </DocPage>
  );
}
