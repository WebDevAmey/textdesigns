import { readFile } from "node:fs/promises";
import path from "node:path";
import { duration, ease, spring, stagger } from "@registry/textlab/lib/motion-tokens";
import { Code, DocPage } from "@/site/doc-page";
import { EaseCurve } from "@/site/ease-curve";

export const metadata = { title: "Tokens", description: "Color, type and motion tokens shared by every Textlab component." };

const swatches = ["--tl-background", "--tl-surface", "--tl-foreground", "--tl-text-secondary", "--tl-accent", "--tl-fx-highlight", "--tl-fx-glow", "--tl-fx-spectrum-1", "--tl-fx-spectrum-2", "--tl-fx-spectrum-3", "--tl-fx-spectrum-4"];

export default async function Tokens() {
  const css = await readFile(path.join(process.cwd(), "registry/textlab/tokens.css"), "utf8");
  return (
    <DocPage title="Tokens" lead="Components read a small set of tokens instead of raw values, so one change restyles the whole library in both themes.">
      <h2>Color</h2>
      <p>Semantic colors fall back to shadcn&apos;s variables when your app defines them. Effect tokens drive highlights, glows and spectrums.</p>
      <div className="not-prose my-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {swatches.map((name) => (
          <div key={name} className="flex items-center gap-3 rounded-lg border p-2.5">
            <span className="size-8 shrink-0 rounded-md border" style={{ background: `var(${name})` }} />
            <code className="truncate font-mono text-[12px] text-secondary">{name}</code>
          </div>
        ))}
      </div>

      <h2>Easing</h2>
      <p>Entrances use ease-out so text arrives fast and lands softly. Things already on screen use a symmetric curve.</p>
      <div className="not-prose my-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(ease).map(([name, curve]) => (
          <EaseCurve key={name} name={name} curve={curve} />
        ))}
      </div>

      <h2>Duration, spring and stagger</h2>
      <div className="not-prose my-5 overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-[13px]">
          <tbody>
            {Object.entries(duration).map(([k, v]) => (
              <tr key={k} className="border-t first:border-t-0">
                <td className="px-4 py-2.5 font-mono">duration.{k}</td>
                <td className="px-4 py-2.5 font-mono text-secondary">{v}s</td>
              </tr>
            ))}
            {Object.entries(spring).map(([k, v]) => (
              <tr key={k} className="border-t">
                <td className="px-4 py-2.5 font-mono">spring.{k}</td>
                <td className="px-4 py-2.5 font-mono text-secondary">
                  {v.visualDuration}s, bounce {v.bounce}
                </td>
              </tr>
            ))}
            {Object.entries(stagger).map(([k, v]) => (
              <tr key={k} className="border-t">
                <td className="px-4 py-2.5 font-mono">stagger.{k}</td>
                <td className="px-4 py-2.5 font-mono text-secondary">{v}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Interface feedback stays under 300 ms. Text entrances can take longer, but opacity always leads so words are readable before the motion settles.
      </p>

      <h2>The stylesheet</h2>
      <Code lang="css" label="tokens.css" code={css} />
    </DocPage>
  );
}
