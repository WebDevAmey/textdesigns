import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            TextLab
          </Link>

          <p className="mt-2 text-sm text-black/40">
            Handcrafted text animations for the web.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-black/50">
          <Link
            href="/animations"
            className="transition-colors hover:text-black"
          >
            Animations
          </Link>

          <a
            href="https://github.com/WebDevAmey/TextLab"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            GitHub
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-black/10 pt-6 text-xs text-black/30">
        <span>© {new Date().getFullYear()} TextLab</span>

        <span>Built with React + GSAP</span>
      </div>
    </footer>
  );
}