import {
  Features,
  Footer,
  Hero,
  Navbar,
} from "@/features/landing";
import CoursesSection from "@/features/courses/components/CoursesSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />

      <Hero />

      <Features />

      <CoursesSection />

      <Footer />
    </main>
  );
}