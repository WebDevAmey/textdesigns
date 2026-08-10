"use client";

import Image from "next/image";
import AnimatedButton from "@/components/ui/animated-button";
import CharacterBlur from "@/components/text/CharacterBlur";

export default function Hero() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-black">

      <section
        id="home"
        className="
          relative isolate overflow-hidden
          px-4
          pb-16
          pt-32
          sm:pt-36
          md:pb-24
        "
      >

        {/* Background image */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[850px] overflow-hidden">
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

          <div className="pt-12 sm:pt-[12vh]">

            {/* Eyebrow */}
            <div
              className="
                mx-auto mb-6
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
                text-[3rem]
                font-medium
                leading-[0.95]
                tracking-[-0.055em]
                text-black/90

                sm:max-w-3xl
                sm:text-6xl
                sm:leading-[0.92]

                md:text-7xl

                lg:text-8xl
              "
            >
              Text that doesn&apos;t
              <br />
              sit still.
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-[21rem]
                text-sm
                leading-6
                text-black/65

                sm:max-w-xl
                sm:text-base
                sm:leading-7

                lg:text-lg
              "
            >
              Handcrafted text animations built with React and GSAP.
              Explore, customise, and copy animations for your next project.
            </p>

            {/* Buttons */}
            <div
              className="
                mx-auto
                mt-8
                flex
                w-full
                max-w-[24rem]
                flex-col
                items-center
                justify-center
                gap-3

                sm:mt-10
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
          <div className="mt-14 w-full max-w-6xl px-0 sm:mt-16 sm:px-4">

            <div
              className="
                relative
                min-h-[420px]
                overflow-hidden
                rounded-[28px]
                border
                border-black/10
                bg-black
                shadow-[0_30px_100px_rgba(0,0,0,0.15)]

                sm:min-h-[520px]
                sm:rounded-[32px]

                md:min-h-[600px]
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
                  Character Blur
                </span>
              </div>

              {/* Animation */}
              <div className="flex min-h-[420px] items-center justify-center px-6 pt-10 sm:min-h-[520px] md:min-h-[600px]">

                <div className="text-4xl font-medium tracking-tight text-white sm:text-6xl md:text-8xl">
                  <CharacterBlur text="Make your text move." />
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

                <span className="text-xs text-white/50">
                  01 / 15
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}