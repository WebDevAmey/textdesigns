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

  useEffect(() => {
    const timer = setTimeout(
      () => setIteration((i) => i + 1),
      LOOP_MS,
    );
    return () => clearTimeout(timer);
  }, [iteration]);

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