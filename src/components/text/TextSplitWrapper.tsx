"use client";
import { TextSplit } from "@/components/ui/split-text";

interface TextSplitWrapperProps {
  text?: string;
}

export default function TextSplitWrapper({
  text = "Split Text",
}: TextSplitWrapperProps) {
  return (
    <TextSplit
      className="text-4xl font-medium"
      maxMove={150}
      falloff={0.1}
    >
      {text}
    </TextSplit>
  );
}
