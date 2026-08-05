export function Navbar() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-xl font-bold">
          Qatra
        </h1>

        <nav className="flex items-center gap-8">
          <a href="#">Courses</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </header>
  );
}