"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedButton from "@/components/ui/animated-button";
import { animations } from "@/lib/animations";

const LOOP_MS = 6000;
const PREVIEW_COUNT = 15;

// Best 15, curated for the hero preview — Character Blur up first.
const PREVIEWS = [
  "character-blur",
  "gravity",
  "3d-flip",
  "shimmer",
  "typewriter",
  "wave",
  "scramble",
  "glitch",
  "rotate",
  "scale",
  "magnetic",
  "word-reveal",
  "char-reveal",
  "blur",
  "fade",
]
  .map((slug) => animations.find((a) => a.slug === slug))
  .filter((a): a is NonNullable<typeof a> => Boolean(a));

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const current = PREVIEWS[index];
  const infinite = "infinite" in current && current.infinite;

  useEffect(() => {
    if (infinite) return;

    const timer = setTimeout(
      () => setReplayKey((k) => k + 1),
      LOOP_MS
    );
    return () => clearTimeout(timer);
  }, [replayKey, index, infinite]);

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + PREVIEWS.length) % PREVIEWS.length);
    setReplayKey(0);
  };

  const Animation = current.component;
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-black">

      <section
        id="home"
        className="
          relative isolate overflow-hidden
          px-4
          pb-14
          pt-24
          sm:pt-28
          md:pb-20
        "
      >

        {/* Background image */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[700px] overflow-hidden">
          <Image
            src="/herodith.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />

          {/* Soft image tint */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Top readability */}
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/90 via-white/30 to-transparent" />

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-white/30 via-white/10 to-transparent" />

          {/* Centre focus */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.1),transparent_55%)]" />
        </div>

        {/* Hero content */}
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">

          <div className="pt-8 sm:pt-[9vh]">

            {/* Eyebrow */}
            <div
              className="
                mx-auto mb-5
                inline-flex
                items-center
                rounded-full
                border border-black/10
                bg-white/50
                px-4 py-2
                text-xs
                font-medium
                tracking-wide
                text-black/70
                backdrop-blur-md
              "
            >
              Text animation library
            </div>

            {/* Heading */}
            <h1
              className="
                mx-auto
                max-w-[22rem]
                text-[2.75rem]
                font-medium
                leading-[0.95]
                tracking-[-0.055em]
                text-black/90

                sm:max-w-3xl
                sm:text-5xl
                sm:leading-[0.92]

                md:text-6xl

                lg:text-7xl
              "
            >
              Text that doesn&apos;t
              <br />
              sit still.
            </h1>

            {/* Buttons */}
            <div
              className="
                mx-auto
                mt-7
                flex
                w-full
                max-w-[24rem]
                flex-col
                items-center
                justify-center
                gap-3

                sm:mt-8
                sm:w-auto
                sm:max-w-none
                sm:flex-row
              "
            >
              <AnimatedButton
                as="a"
                href="/animations"
                className="h-12 w-full px-8 sm:w-auto"
              >
                Explore animations
              </AnimatedButton>

              <AnimatedButton
                as="a"
                href="https://github.com/WebDevAmey/TextLab"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-full px-8 sm:w-auto"
              >
                GitHub
              </AnimatedButton>
            </div>

          </div>

          {/* Animation preview */}
          <div className="mt-10 w-full max-w-6xl px-0 sm:mt-12 sm:px-4">

            <div
              className="
                relative
                min-h-[340px]
                overflow-hidden
                rounded-[24px]
                border
                border-black/10
                bg-black
                shadow-[0_30px_100px_rgba(0,0,0,0.15)]

                sm:min-h-[440px]
                sm:rounded-[28px]

                md:min-h-[500px]
              "
            >

              {/* Preview header */}
              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  z-20
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/10
                  px-5
                  py-4
                  text-white/60

                  sm:px-6
                "
              >
                <span className="text-xs font-medium tracking-wide">
                  LIVE PREVIEW
                </span>

                <span className="text-xs">
                  {current.name}
                </span>
              </div>

              {/* Animation */}
              <div className="flex min-h-[340px] items-center justify-center px-6 pt-10 sm:min-h-[440px] md:min-h-[500px]">

                <div className="text-4xl font-medium tracking-tight text-white sm:text-6xl md:text-8xl">
                  <Animation
                    key={`${index}:${replayKey}`}
                    text="Make your text move."
                  />
                </div>

              </div>

              {/* Preview footer */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/10
                  bg-black/40
                  px-5
                  py-4
                  backdrop-blur-md

                  sm:px-6
                "
              >
                <span className="text-xs text-white/50">
                  React + GSAP
                </span>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/50">
                    {String(index + 1).padStart(2, "0")} / {PREVIEW_COUNT}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous animation"
                      onClick={() => goTo(index - 1)}
                      className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/60 transition-all duration-300 hover:border-white/50 hover:bg-white hover:text-black"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Next animation"
                      onClick={() => goTo(index + 1)}
                      className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/60 transition-all duration-300 hover:border-white/50 hover:bg-white hover:text-black"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}