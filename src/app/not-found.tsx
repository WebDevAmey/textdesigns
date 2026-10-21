import Link from "next/link";
import { GlitchText } from "@registry/textlab/glitch-text/glitch-text";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70dvh] max-w-[1400px] flex-col justify-center px-4 py-24 sm:px-6">
      <GlitchText as="h1" text="Lost the thread." trigger="mount" className="font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.045em]" />
      <p className="mt-6 max-w-md text-lg text-secondary">This page does not exist. The components are all still here.</p>
      <div className="mt-8 flex items-center gap-5">
        <Link href="/components" className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition-transform duration-150 active:scale-[0.97]">
          Browse the effects
        </Link>
        <Link href="/" className="text-[15px] text-secondary underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-current">
          Go home
        </Link>
      </div>
    </main>
  );
}
