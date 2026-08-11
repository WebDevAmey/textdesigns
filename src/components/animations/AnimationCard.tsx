"use client";

import Link from "next/link";
import { useRef } from "react";

interface AnimationCardProps {
  name: string;
  slug: string;
  description: string;
  component: React.ComponentType<{ text: string }>;
}

export default function AnimationCard({
  name,
  slug,
  description,
  component: Animation,
}: AnimationCardProps) {
  const animationKey = useRef(0);

  const replay = () => {
    animationKey.current += 1;
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

      {/* Preview */}
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden px-6">

        <div className="text-5xl font-medium tracking-tight">
          <Animation
            key={animationKey.current}
            text={name}
          />
        </div>

        {/* Replay */}
        <button
          type="button"
          onClick={replay}
          className="
            absolute
            bottom-4
            right-4
            rounded-full
            border
            border-black/10
            bg-white
            px-4
            py-2
            text-xs
            font-medium
            opacity-0
            shadow-sm
            transition-all
            duration-200
            group-hover:opacity-100
            hover:-translate-y-0.5
          "
        >
          Replay
        </button>

      </div>

      {/* Information */}
      <div className="border-t border-black/10 p-6">

        <div className="flex items-start justify-between gap-6">

          <div>
            <h2 className="font-medium">
              {name}
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-black/45">
              {description}
            </p>
          </div>

          <Link
            href={`/animations/${slug}`}
            className="
              shrink-0
              text-sm
              font-medium
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            View →
          </Link>

        </div>

      </div>

    </article>
  );
}