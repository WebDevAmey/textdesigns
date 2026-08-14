import { readFile } from "node:fs/promises";
import path from "node:path";
import AnimationDocs from "@/components/animations/AnimationDocs";
import { docGroups } from "@/lib/animations-docs";

export default async function AnimationsPage() {
  const groups = await Promise.all(
    docGroups.map(async (group) => {
      const docs = await Promise.all(
        group.docs.map(async (doc) => {
          if (!doc.sourceFile) return doc;
          try {
            const source = await readFile(
              path.join(process.cwd(), "src/components/text", doc.sourceFile),
              "utf8"
            );
            return { ...doc, source };
          } catch {
            return doc;
          }
        })
      );
      return { ...group, docs };
    })
  );

  return <AnimationDocs groups={groups} />;
}