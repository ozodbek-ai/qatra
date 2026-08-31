import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold" aria-label="Qatra home">
          Qatra
        </Link>

        <nav
          className="flex items-center gap-8"
          aria-label="Main navigation"
        >
          <a href="#courses">Courses</a>
          <a href="#features">About</a>
          <a href="#contact">Contact</a>

          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[var(--color-primary)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}