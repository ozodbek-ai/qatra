import {
  Features,
  Footer,
  Hero,
  Navbar,
} from "@/features/landing";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />

      <Hero />

      <Features />

      <Footer />
    </main>
  );
}