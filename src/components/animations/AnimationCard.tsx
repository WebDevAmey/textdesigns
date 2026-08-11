"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface AnimationCardProps {
  name: string;
  slug: string;
  description: string;
  component: React.ComponentType<{ text: string }>;
}

const LOOP_MS = 3000;

export default function AnimationCard({
  name,
  slug,
  description,
  component: Animation,
}: AnimationCardProps) {
  const [iteration, setIteration] = useState(0);

  // Automatically replay the animation
  useEffect(() => {
    const timer = setTimeout(
      () => setIteration((i) => i + 1),
      LOOP_MS
    );

    return () => clearTimeout(timer);
  }, [iteration]);

  // Manually replay the animation
  const replay = () => {
    setIteration((i) => i + 1);
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

      {/* Preview */}
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden px-6">

        <div className="text-5xl font-medium tracking-tight">
          <Animation
            key={iteration}
            text={name}
          />
        </div>

        {/* Replay button */}
        <button
          type="button"
          onClick={replay}
          aria-label={`Replay ${name} animation`}
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
            shadow-sm
            transition-all
            duration-200
            opacity-100
            sm:opacity-0
            sm:group-hover:opacity-100
            hover:-translate-y-0.5
            hover:shadow-md
          "
        >
          Replay ↻
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