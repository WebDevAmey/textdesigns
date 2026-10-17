import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentMeta } from "@registry/types";

const ROOT = path.join(process.cwd(), "registry", "textlab");

/** Files that ship with a component, as [display path, contents]. */
export async function componentFiles(meta: ComponentMeta): Promise<{ path: string; code: string }[]> {
  const names = [`${meta.name}.tsx`, ...(meta.files ?? [])];
  return Promise.all(
    names.map(async (file) => ({
      path: `components/textlab/${meta.name}/${file}`,
      code: await readFile(path.join(ROOT, meta.name, file), "utf8"),
    })),
  );
}

export async function demoSource(name: string): Promise<string | null> {
  try {
    return await readFile(path.join(process.cwd(), "src", "demos", `${name}.tsx`), "utf8");
  } catch {
    return null;
  }
}
