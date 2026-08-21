'use client';
import { TextDisperse as TextDisperseUI } from "@/components/ui/text-disperse";

interface TextDisperseProps {
  text: string;
}

export default function TextDisperse({ text }: TextDisperseProps) {
  return (
    <TextDisperseUI className="text-[6vw]">
      {text}
    </TextDisperseUI>
  );
}
