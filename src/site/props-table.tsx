import type { PropDoc } from "@registry/types";

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
        <thead className="bg-surface text-secondary">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Prop</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Default</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-t align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-foreground">
                {prop.name}
                {prop.required ? <span className="ml-1 text-accent" aria-label="required">*</span> : null}
              </td>
              <td className="px-4 py-3 font-mono text-secondary">{prop.type}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-secondary">{prop.default ?? "–"}</td>
              <td className="px-4 py-3 text-secondary">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
