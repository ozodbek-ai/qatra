import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
      <span className="rounded-full bg-blue-600/15 px-4 py-2 text-sm text-blue-400">
        Modern Learning Platform
      </span>

      <h1 className="mt-8 max-w-4xl text-6xl font-bold leading-tight">
        Learn modern skills.
        <br />
        Build your future.
      </h1>

      <p className="mt-8 max-w-2xl text-lg text-[var(--color-muted)]">
        Qatra is a professional learning management platform
        built for students, educators and organizations.
      </p>

      <div className="mt-12 flex gap-4">
        <Button>
          Get Started
        </Button>

        <Button variant="outline">
          Browse Courses
        </Button>
      </div>
    </section>
  );
}