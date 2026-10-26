"use client";

import { CloudShader } from "@/components/ui/cloud-shader";

export default function CloudShaderHeroDemo() {
  return (
    <div className="relative min-h-[50rem] w-full overflow-hidden">
      <CloudShader className="absolute inset-0" />

      {/* navbar */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-sm font-bold text-sky-700 shadow-sm">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
            Altitude
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
          <a href="#" className="transition hover:text-white">
            Features
          </a>
          <a href="#" className="transition hover:text-white">
            Pricing
          </a>
          <a href="#" className="transition hover:text-white">
            Docs
          </a>
          <a href="#" className="transition hover:text-white">
            Blog
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden text-sm font-medium text-white/90 transition hover:text-white sm:block"
          >
            Sign in
          </a>
          <a
            href="#"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-white/90"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* hero */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 text-center md:pt-20">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-6xl lg:text-7xl">
          Banking above <br className="hidden md:block" /> the clouds
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/90 drop-shadow-sm md:text-lg">
          Altitude gives your finance team one home for cards, payments, and
          forecasting. Close the books in hours, not weeks, with automation
          that works while you sleep.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-sky-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90"
          >
            Start for free
          </a>
          <a
            href="#"
            className="rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Book a demo
          </a>
        </div>
        <p className="mt-4 text-xs text-white/70">
          No credit card required &middot; Free 14-day trial
        </p>
      </div>

      {/* dashboard image */}
      <div className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-4 md:mt-16 md:px-8">
        <div className="rounded-2xl border border-white/30 bg-white/20 p-2 shadow-2xl backdrop-blur-md md:rounded-[2rem] md:p-3">
          <img
            src="https://assets.aceternity.com/screenshots/fintech-dashboard.webp"
            alt="Altitude fintech dashboard"
            className="w-full rounded-xl border border-black/5 shadow-lg md:rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}
