"use client";
import { TextLoop } from "@/components/ui/text-loop";

interface TextLoopWrapperProps {
  text?: string;
}

export default function TextLoopWrapper({
  text = "Text Loop",
}: TextLoopWrapperProps) {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <TextLoop
        text={text}
        shape="wave"
        speed={60}
        direction="forward"
        separator="✦"
        curviness={120}
        fontSize={64}
        fontWeight={900}
        letterSpacing={4}
        uppercase={true}
        color="url(#gradient)"
        ribbon={false}
        ribbonWidth={0}
        pauseOnHover={true}
      />
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
