import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import type { ComponentType } from "react";
import { catalog } from "@registry/catalog";

/* eslint-disable @typescript-eslint/no-explicit-any */
const load = async (name: string): Promise<ComponentType<any>> => {
  const mod = await import(`../registry/textlab/${name}/${name}.tsx`);
  return mod.default;
};

// Components whose readable content is their children rather than a text prop.
const childrenFor: Record<string, string> = { "underline-draw": "today", "circle-annotate": "scales", "marker-highlight": "free and open source", "cursor-trail": "Move your pointer here" };

function propsFor(meta: (typeof catalog)[number]) {
  const base: Record<string, unknown> = { ...meta.preset };
  if (meta.props.some((p) => p.name === "text") && base.text === undefined) base.text = "Make every word count";
  if (meta.props.some((p) => p.name === "words") && base.words === undefined) base.words = ["alpha", "beta"];
  if (meta.props.some((p) => p.name === "value") && base.value === undefined) base.value = 1234;
  if (meta.name === "countdown") base.to = Date.now() + 86_400_000;
  return base;
}

/** The words a reader should be able to find somewhere in the output, visible or screen-reader only. */
function expectedText(meta: (typeof catalog)[number], props: Record<string, unknown>) {
  if (childrenFor[meta.name]) return childrenFor[meta.name];
  if (typeof props.text === "string") return props.text.split(/\s+/)[0];
  if (Array.isArray(props.words)) return String(props.words[0]);
  return null;
}

describe.each(catalog.map((m) => [m.name, m] as const))("%s", (name, meta) => {
  const props = propsFor(meta);
  const children = childrenFor[name];

  it("renders the still version under reduced motion with its text", async () => {
    const Component = await load(name);
    const { container } = render(<Component {...props} reducedMotion="always">{children}</Component>);
    const words = expectedText(meta, props);
    if (words) expect(container.textContent).toContain(words);
    expect(container.querySelector("[data-tl-part]")).toBeNull();
  });

  it("renders the animated version without crashing", async () => {
    if (meta.heavy) return; // canvas and WebGL need a real browser
    const Component = await load(name);
    const { container } = render(<Component {...props}>{children}</Component>);
    expect(container.firstChild).not.toBeNull();
  });

  it("has no detectable accessibility violations", async () => {
    const Component = await load(name);
    const { container } = render(<Component {...props} reducedMotion={meta.heavy ? "always" : "user"}>{children}</Component>);
    const result = await axe.run(container, { rules: { region: { enabled: false } } });
    expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
