"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface AnimationCardProps {
  name: string;
  slug: string;
  description: string;
  component: React.ComponentType<{ text: string }>;
}

const LOOP_MS = 5000;

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

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]">

      {/* Preview */}
      <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-neutral-50 px-6">

        {/* Live preview chip */}
        <span className="absolute left-5 top-5 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-black/40 shadow-sm">
          Live preview
        </span>

        <div className="relative whitespace-nowrap text-center text-3xl font-medium leading-none tracking-tight text-black/90">
          <Animation
            key={iteration}
            text={name}
          />
        </div>

      </div>

      {/* Information */}
      <div className="border-t border-black/5 bg-white p-6">

        <div className="flex items-start justify-between gap-6">

          <div>
            <h2 className="text-lg font-medium tracking-tight text-black/90">
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
              rounded-full
              border
              border-black/10
              px-4
              py-2
              text-sm
              font-medium
              text-black/70
              transition-all
              duration-300
              group-hover:border-black/20
              group-hover:bg-black
              group-hover:text-white
            "
          >
            View →
          </Link>

        </div>

      </div>

    </article>
  );
}