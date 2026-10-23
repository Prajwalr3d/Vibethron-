import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="relative z-10 border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Logo />
          <span className="min-w-0">
            <span className="block font-display text-xl font-semibold leading-none tracking-tight">
              Vibe<em className="font-medium text-redpen">Shift</em>
            </span>
            <span className="mt-1 hidden truncate text-xs text-ink-soft sm:block">
              We show you exactly what changed, and prove your facts survived.
            </span>
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
