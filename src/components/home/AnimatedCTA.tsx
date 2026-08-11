"use client";

import MagneticText from "@/components/text/MagneticText";
import AnimatedButton from "@/components/ui/animated-button";

export default function AnimatedCTA() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center justify-center overflow-hidden rounded-[32px] bg-black px-6 text-center text-white sm:min-h-[600px]">

        {/* Subtle background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">

          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Your turn
          </p>

          <h2 className="max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-7xl md:text-8xl">
            <MagneticText text="Make text move." />
          </h2>

          <p className="mt-7 max-w-md text-base leading-7 text-white/50">
            Explore the complete collection of handcrafted text animations.
          </p>

          <div className="mt-9">
            <AnimatedButton
              as="a"
              href="/animations"
              className="px-7 py-3"
            >
              Explore animations
            </AnimatedButton>
          </div>

        </div>
      </div>
    </section>
  );
}