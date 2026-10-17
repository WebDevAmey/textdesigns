"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyComponent = ComponentType<any>;

/** Each component, loaded only on the pages that show it. */
export const components: Record<string, AnyComponent> = {
  "blur-reveal": dynamic(() => import("@registry/textlab/blur-reveal/blur-reveal")),
};

/** Custom demos for components that need a stage: scroll areas, changing values, controls. */
export const demos: Record<string, ComponentType<DemoProps>> = {};

export interface DemoProps {
  variant: string;
  /** Props from the playground or preset. */
  props: Record<string, unknown>;
}
