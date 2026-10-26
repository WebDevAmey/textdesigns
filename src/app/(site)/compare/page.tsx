import { DocPage } from "@/site/doc-page";

export const metadata = { title: "Compare", description: "How Textlab compares with other React libraries that ship text effects." };

const rows: { label: string; values: string[] }[] = [
  { label: "Focus", values: ["Text effects only", "Interface components and blocks", "Animated components, backgrounds and text", "Animated components and effects"] },
  { label: "Text effects", values: ["70", "A handful", "Dozens", "Dozens"] },
  { label: "License", values: ["MIT", "MIT, plus paid Pro", "MIT + Commons Clause", "MIT, plus paid Pro"] },
  { label: "Install", values: ["shadcn CLI", "shadcn CLI", "shadcn CLI", "shadcn CLI"] },
  { label: "Markdown per component", values: ["Yes", "Yes", "Yes", "See their docs"] },
  { label: "MCP server", values: ["Yes, own", "Yes, own", "Via the shadcn MCP server", "See their docs"] },
  { label: "Reduced motion in every component", values: ["Yes, tested", "Yes", "See their docs", "See their docs"] },
  { label: "Screen-reader text for split effects", values: ["Yes, tested", "Yes", "See their docs", "See their docs"] },
];

export default function Compare() {
  return (
    <DocPage title="Compare" lead="Textlab is narrow on purpose: only text, done thoroughly. Here is how it sits next to libraries that include text effects among other things.">
      <div className="not-prose my-6 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-surface text-secondary">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium" />
              {["Textlab", "Arc", "React Bits", "Magic UI"].map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 font-medium text-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t align-top">
                <th scope="row" className="px-4 py-2.5 font-medium">
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className="px-4 py-2.5 text-secondary">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Facts about other libraries are as each project published them when checked in October 2026, rounded where counts change often. Check their sites for the latest.</p>
      <h2>When to pick something else</h2>
      <ul>
        <li>You need buttons, dialogs and dashboards: pick a general library and add Textlab for the type.</li>
        <li>You want animated backgrounds and 3D scenes beyond text: React Bits and Magic UI cover more ground.</li>
      </ul>
    </DocPage>
  );
}
