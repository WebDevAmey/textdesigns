import Link from "next/link";
import AnimationCard from "@/components/animations/AnimationCard";
import LiquidText from "@/components/text/LiquidText";
import { animations } from "@/lib/animations";

export default function AnimationsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-32 text-black">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="max-w-3xl">

          <Link
            href="/"
            className="mb-5 block text-xs font-medium uppercase tracking-[0.2em] text-black/40 transition-colors duration-200 hover:text-black"
          >
            TextLab
          </Link>

          <LiquidText
            text="Text animations."
            className="text-5xl font-medium tracking-[-0.05em] sm:text-7xl"
            innerClassName="inline-block text-5xl font-medium leading-none tracking-[-0.05em] text-black sm:text-7xl"
          />

          <p className="mt-6 max-w-xl text-base leading-7 text-black/50 sm:text-lg">
            A collection of handcrafted text animations built with
            React and GSAP.
          </p>

        </div>

        {/* Animation Grid */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {animations.map((animation) => (
            <AnimationCard
              key={animation.slug}
              {...animation}
            />
          ))}
        </div>

      </div>

    </main>
  );
}