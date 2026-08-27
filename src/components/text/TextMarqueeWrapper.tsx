"use client";
import { TextMarquee } from "@/components/ui/text-marquee";

interface TextMarqueeWrapperProps {
  text?: string;
}

export default function TextMarqueeWrapper({
  text = "Text Marquee",
}: TextMarqueeWrapperProps) {
  const words = text.split(" ");

  return (
    <TextMarquee
      height={80}
      speed={0.8}
      className="text-3xl font-bold"
    >
      {words.map((word, i) => (
        <span key={i}>{word}</span>
      ))}
    </TextMarquee>
  );
}
