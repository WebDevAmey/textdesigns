import Link from "next/link";
import MagneticFluxText from "@/components/text/MagneticFluxText";
import MoltenMetalText from "@/components/text/MoltenMetalText";
import ResonantChainText from "@/components/text/ResonantChainText";

export default function ExperimentsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-32 text-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-32">
        <Link
          href="/"
          className="w-fit rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition-all duration-300 hover:border-black/20 hover:bg-black hover:text-white"
        >
          ← Back to home
        </Link>
        <section>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Flux
          </h2>
          <p className="mb-10 text-sm text-black/50">
            Move the cursor near the letters.
          </p>
          <MagneticFluxText text="FLUX" />
        </section>

        <section>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Flux — Glyphs
          </h2>
          <p className="mb-10 text-sm text-black/50">
            The letterforms made of flowing particles. Hover to sweep them, click to shove.
          </p>
          <MagneticFluxText text="GLYPHS" layer="glyphs" />
        </section>

        <section>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Temper
          </h2>
          <p className="mb-10 text-sm text-black/50">
            Hover to ripple it, press and drag to really pull it.
          </p>
          <MoltenMetalText text="TEMPER" />
        </section>

        <section>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Resonant Chain
          </h2>
          <p className="mb-10 text-sm text-black/50">
            Drag a letter, click between letters to pluck, or drag across to strum.
          </p>
          <ResonantChainText text="RESONANCE" />
        </section>
      </div>
    </main>
  );
}
