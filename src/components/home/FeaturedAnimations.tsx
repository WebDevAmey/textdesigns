"use client";

import Link from "next/link";

import GravityText from "@/components/text/GravityText";

import CharacterBlur from "@/components/text/CharacterBlur";

import FlipText from "@/components/text/FlipText";

export default function FeaturedAnimations() {

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

          {/* Gravity */}

          <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden px-6">

              <div className="text-4xl font-medium tracking-tight sm:text-5xl">

                <GravityText text="Gravity" />

              </div>

            </div>

            <div className="border-t border-black/10 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-medium">

                    Gravity

                  </h3>

                  <p className="mt-1 text-sm text-black/45">

                    Characters fall and settle with physical motion.

                  </p>

                </div>

                <span className="transition-transform duration-300 group-hover:translate-x-1">

                  →

                </span>

              </div>

            </div>

          </article>

          {/* Character Blur */}

          <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden px-6">

              <div className="text-4xl font-medium tracking-tight sm:text-5xl">

                <CharacterBlur text="Blur" />

              </div>

            </div>

            <div className="border-t border-black/10 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-medium">

                    Character Blur

                  </h3>

                  <p className="mt-1 text-sm text-black/45">

                    Characters emerge from a soft blur.

                  </p>

                </div>

                <span className="transition-transform duration-300 group-hover:translate-x-1">

                  →

                </span>

              </div>

            </div>

          </article>

          {/* Flip */}

          <article className="group overflow-hidden rounded-3xl border border-black/10 bg-neutral-50">

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden px-6">

              <div className="text-4xl font-medium tracking-tight sm:text-5xl">

                <FlipText text="Flip" />

              </div>

            </div>

            <div className="border-t border-black/10 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-medium">

                    3D Flip

                  </h3>

                  <p className="mt-1 text-sm text-black/45">

                    Characters rotate into view in 3D.

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