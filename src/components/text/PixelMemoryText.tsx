"use client";

import MagneticFluxText from "@/components/text/MagneticFluxText";

export default function PixelMemoryText({ text }: { text: string }) {
  return <MagneticFluxText text={text} layer="glyphs" />;
}