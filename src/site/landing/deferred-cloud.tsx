"use client";

import { useEffect, useState } from "react";
import { CloudShader } from "@/components/ui/cloud-shader";

/**
 * Paints the shader's sky colors as a plain gradient first, then mounts the WebGL clouds once the
 * browser is idle, so compiling the shader never competes with the first paint and hydration.
 */
export function DeferredCloud() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);
  return (
    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,#3876ba,#8cbfe8)]">
      {ready && <CloudShader className="absolute inset-0 animate-[tl-fade-in_900ms_ease-out_both]" />}
    </div>
  );
}
