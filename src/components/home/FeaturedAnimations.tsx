"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ShimmerText from "@/components/text/ShimmerText";

import CharacterReveal from "@/components/text/CharacterReveal";

import TypewriterText from "@/components/text/TypewriterText";

const LOOP_MS = 6000;

export default function FeaturedAnimations() {

  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setIteration((i) => i + 1),
      LOOP_MS
    );
    return () => clearTimeout(timer);
  }, [iteration]);

  return (

    <section className="px-6 py-32 sm:py-40">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-black/40">

              Explore the collection

            </p>

            <h2 className="max-w-2xl text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">

              A few things we&apos;ve made text do.

            </h2>

          </div>

          <Link

            href="/animations"

            className="group flex items-center gap-2 text-sm font-medium"

          >

            View all animations

            <span className="transition-transform duration-300 group-hover:translate-x-1">

              →

            </span>

          </Link>

        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-5 md:grid-cols-3">

          {/* Shimmer */}

          <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden px-6">

              <div className="text-4xl font-medium tracking-tight sm:text-5xl">

                <ShimmerText key={iteration} text="Shimmer" />

              </div>

            </div>

            <div className="border-t border-black/10 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-medium">

                    Shimmer

                  </h3>

                  <p className="mt-1 text-sm text-black/45">

                    A soft light gradient sweeps across the text on loop or hover.

                  </p>

                </div>

                <span className="transition-transform duration-300 group-hover:translate-x-1">

                  →

                </span>

              </div>

            </div>

          </article>

          {/* Char Reveal */}

          <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden px-6">

              <div className="text-4xl font-medium tracking-tight sm:text-5xl">

                <CharacterReveal key={iteration} text="Char Reveal" />

              </div>

            </div>

            <div className="border-t border-black/10 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-medium">

                    Char Reveal

                  </h3>

                  <p className="mt-1 text-sm text-black/45">

                    Characters reveal themselves individually.

                  </p>

                </div>

                <span className="transition-transform duration-300 group-hover:translate-x-1">

                  →

                </span>

              </div>

            </div>

          </article>

          {/* Typewriter */}

          <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden px-6">

              <div className="text-4xl font-medium tracking-tight sm:text-5xl">

                <TypewriterText key={iteration} text="Typewriter" />

              </div>

            </div>

            <div className="border-t border-black/10 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-medium">

                    Typewriter

                  </h3>

                  <p className="mt-1 text-sm text-black/45">

                    A natural typing and deletion effect with a blinking cursor.

                  </p>

                </div>

                <span className="transition-transform duration-300 group-hover:translate-x-1">

                  →

                </span>

              </div>

            </div>

          </article>

        </div>

      </div>

    </section>

  );
}