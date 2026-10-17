/**
 * Writes everything agents and the shadcn CLI read:
 *   public/r/<name>.json, registry.json, catalog.json, skills
 *   public/components/<name>.md
 *   public/llms.txt, llms-small.txt, llms-full.txt
 * Output is deterministic and git-ignored; `pnpm build` and `pnpm dev` regenerate it.
 */
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { catalog } from "../registry/catalog";
import { categories, type ComponentMeta } from "../registry/types";
import { componentMarkdown } from "../src/site/markdown";
import { registryUrl, site } from "../src/site/config";
import { buildItem, buildLibItem, buildTokensItem, type RegistryItem } from "../src/site/registry-items";
import { llmsFull, llmsIndex, llmsSmall, skillMarkdown } from "../src/site/llms";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(ROOT, "registry", "textlab");

async function read(...parts: string[]) {
  return readFile(path.join(...parts), "utf8");
}

async function main() {
  await rm(path.join(PUBLIC, "r"), { recursive: true, force: true });
  await rm(path.join(PUBLIC, "components"), { recursive: true, force: true });
  await mkdir(path.join(PUBLIC, "r", "skills", "textlab"), { recursive: true });
  await mkdir(path.join(PUBLIC, "components"), { recursive: true });

  const libFiles = (await readdir(path.join(SRC, "lib"))).filter((f) => /\.(ts|tsx)$/.test(f)).sort();
  const lib = buildLibItem(await Promise.all(libFiles.map(async (file) => ({ file, content: await read(SRC, "lib", file) }))));
  const tokens = buildTokensItem(await read(SRC, "tokens.css"));

  const items: RegistryItem[] = [lib, tokens];
  const sources = new Map<string, { path: string; code: string }[]>();
  for (const meta of catalog) {
    const names = [`${meta.name}.tsx`, ...(meta.files ?? [])];
    const files = await Promise.all(names.map(async (file) => ({ file, content: await read(SRC, meta.name, file) })));
    items.push(buildItem(meta, files));
    sources.set(meta.name, files.map((f) => ({ path: `components/textlab/${meta.name}/${f.file}`, code: f.content })));
  }

  for (const item of items) {
    await writeFile(path.join(PUBLIC, "r", `${item.name}.json`), JSON.stringify(item, null, 2) + "\n");
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "textlab",
    homepage: site.url,
    items: items.map(({ files, ...rest }) => ({ ...rest, files: files.map(({ content: _content, ...f }) => f) })),
  };
  await writeFile(path.join(PUBLIC, "r", "registry.json"), JSON.stringify(registry, null, 2) + "\n");

  const catalogJson = {
    name: "textlab",
    homepage: site.url,
    count: catalog.length,
    categories,
    items: catalog.map((meta: ComponentMeta) => ({
      ...meta,
      url: `${site.url}/components/${meta.name}`,
      markdown: `${site.url}/components/${meta.name}.md`,
      registry: registryUrl(meta.name),
      install: `npx shadcn@latest add ${registryUrl(meta.name)}`,
    })),
  };
  await writeFile(path.join(PUBLIC, "r", "catalog.json"), JSON.stringify(catalogJson, null, 2) + "\n");

  const pages = new Map<string, string>();
  for (const meta of catalog) {
    const md = componentMarkdown(meta, sources.get(meta.name));
    pages.set(meta.name, md);
    await writeFile(path.join(PUBLIC, "components", `${meta.name}.md`), md);
  }

  await writeFile(path.join(PUBLIC, "llms.txt"), llmsIndex());
  await writeFile(path.join(PUBLIC, "llms-small.txt"), llmsSmall());
  await writeFile(path.join(PUBLIC, "llms-full.txt"), llmsFull(pages));
  await writeFile(path.join(PUBLIC, "r", "skills", "textlab", "SKILL.md"), skillMarkdown());

  console.log(`registry: ${items.length} items, ${catalog.length} components, ${pages.size} markdown pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
