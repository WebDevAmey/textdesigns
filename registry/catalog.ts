import type { ComponentMeta } from "./types";
import { meta as blurReveal } from "./textlab/blur-reveal/meta";
import { meta as wordReveal } from "./textlab/word-reveal/meta";
import { meta as lineReveal } from "./textlab/line-reveal/meta";

/** Every component, in sidebar order within its category. */
export const catalog: ComponentMeta[] = [blurReveal];

export const byName = (name: string) => catalog.find((entry) => entry.name === name);
