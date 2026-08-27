"use client";
import { TextLoop } from "@/components/ui/text-loop";

interface TextLoopWrapperProps {
  text?: string;
}

export default function TextLoopWrapper({
  text = "Text Loop",
}: TextLoopWrapperProps) {
  return (
    <TextLoop
      text={text}
      shape="wave"
      speed={90}
      direction="forward"
      separator="✦"
      curviness={90}
      fontSize={46}
      fontWeight={800}
      letterSpacing={2}
      uppercase={true}
      color="#ffffff"
      ribbon={true}
      ribbonColor="#5227FF"
      ribbonWidth={86}
      pauseOnHover={true}
    />
  );
}
