import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { catalog } from "@registry/catalog";
import { categories } from "@registry/types";
import { componentMarkdown } from "@/site/markdown";
import { buildItem } from "@/site/registry-items";

const ROOT = path.join(process.cwd(), "registry", "textlab");
const LIB = new Set(readdirSync(path.join(ROOT, "lib")).map((f) => f.replace(/\.(ts|tsx)$/, "")));

describe("catalog", () => {
  it("has unique kebab-case names", () => {
    const names = catalog.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toMatch(/^[a-z]+(-[a-z0-9]+)*$/);
  });

  it.each(catalog.map((c) => [c.name, c] as const))("%s is complete", (_name, meta) => {
    expect(categories.map((c) => c.id)).toContain(meta.category);
    expect(meta.description.length).toBeGreaterThan(8);
    expect(meta.description).not.toMatch(/—/);
    expect(meta.variants.length).toBeGreaterThanOrEqual(2);
    expect(meta.variants.length).toBeLessThanOrEqual(4);
    expect(meta.props.length).toBeGreaterThan(2);
    expect(meta.reducedMotion.length).toBeGreaterThan(8);
    expect(meta.whenToUse.length).toBeGreaterThan(0);
    expect(meta.accessibility.length).toBeGreaterThan(0);
    expect(existsSync(path.join(ROOT, meta.name, `${meta.name}.tsx`))).toBe(true);
  });
});

// Related links can point ahead to components that land later; once the catalog is complete every link must resolve.
it.skipIf(catalog.length < 60)("every related link resolves", () => {
  const names = catalog.map((c) => c.name);
  for (const meta of catalog) for (const r of meta.related ?? []) expect(names).toContain(r);
});

describe("registry items", () => {
  it.each(catalog.map((c) => [c.name, c] as const))("%s imports only shipped files", (_name, meta) => {
    const files = [`${meta.name}.tsx`, ...(meta.files ?? [])];
    for (const file of files) {
      const source = readFileSync(path.join(ROOT, meta.name, file), "utf8");
      expect(source).toMatch(/^"use client";/);
      const imports = [...source.matchAll(/from\s+"(\.[^"]+)"/g)].map((m) => m[1]);
      for (const spec of imports) {
        if (spec.startsWith("../lib/")) expect(LIB.has(spec.slice(7))).toBe(true);
        else if (spec.startsWith("./")) expect(files.some((f) => f.startsWith(spec.slice(2)))).toBe(true);
        else {
          const other = spec.split("/")[1];
          expect(meta.uses ?? []).toContain(other);
        }
      }
      const bare = [...source.matchAll(/from\s+"([^.][^"]*)"/g)].map((m) => m[1].split("/")[0]);
      for (const pkg of bare) expect(["react", ...meta.dependencies]).toContain(pkg);
    }
  });

  it("builds a valid registry item", () => {
    const meta = catalog[0];
    const item = buildItem(meta, [{ file: `${meta.name}.tsx`, content: "x" }]);
    expect(item.type).toBe("registry:ui");
    expect(item.registryDependencies?.some((d) => d.endsWith("/r/text-fx.json"))).toBe(true);
    expect(item.files[0].target).toBe(`@components/textlab/${meta.name}/${meta.name}.tsx`);
  });
});

describe("markdown", () => {
  it("includes every section agents rely on", () => {
    const md = componentMarkdown(catalog[0]);
    for (const heading of ["## When to use", "## When not to use", "## Installation", "## Usage", "## API reference", "## Accessibility", "## Motion", "## Reduced motion", "## Performance", "## Notes for AI"]) {
      expect(md).toContain(heading);
    }
  });
});
