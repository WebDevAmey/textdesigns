"use client";

import GravityText from "@/components/text/GravityText";

export default function IntroSection() {
  return (
    <section className="px-6 py-32 sm:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">

        {/* Left */}
        <div>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Built for motion
          </p>

          <h2 className="max-w-xl text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Text shouldn&apos;t just be displayed.
          </h2>

          <p className="mt-6 max-w-md text-base leading-7 text-black/50 sm:text-lg">
            TextLab is a collection of handcrafted text animations
            designed to make typography feel alive.
          </p>
        </div>

        {/* Right */}
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-black/10 bg-neutral-50 p-8">
          <div className="text-4xl font-medium tracking-tight sm:text-6xl">
            <GravityText text="Make it move." />
          </div>
        </div>

      </div>
    </section>
  );
}