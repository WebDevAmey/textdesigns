"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { Segmented } from "./segmented";

export interface CodeFile {
  label: string;
  html: string;
  raw: string;
}

/** Highlighted code with a file switcher and a copy button. Highlighting happens on the server. */
export function CodeView({ files, maxHeight = 520 }: { files: CodeFile[]; maxHeight?: number }) {
  const [active, setActive] = useState(files[0]?.label ?? "");
  const file = files.find((f) => f.label === active) ?? files[0];
  if (!file) return null;
  return (
    <div className="overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        {files.length > 1 ? (
          <Segmented size="sm" label="File" value={active} options={files.map((f) => f.label)} onChange={setActive} format={(v) => v} />
        ) : (
          <span className="px-2 font-mono text-xs text-secondary">{file.label}</span>
        )}
        <CopyButton value={file.raw} label={`Copy ${file.label}`} />
      </div>
      <div className="overflow-auto px-4 py-3.5 font-mono text-[13px] leading-6" style={{ maxHeight }} dangerouslySetInnerHTML={{ __html: file.html }} />
    </div>
  );
}
