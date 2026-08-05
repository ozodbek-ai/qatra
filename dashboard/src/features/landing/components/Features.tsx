import {
  BookOpen,
  Award,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui";

const items = [
  {
    icon: BookOpen,
    title: "Professional Courses",
    text: "Industry focused learning materials.",
  },
  {
    icon: Award,
    title: "Certificates",
    text: "Receive verified certificates.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    text: "Monitor every learning milestone.",
  },
];

export function Features() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="space-y-5 pt-6">
              <Icon className="h-10 w-10 text-blue-500" />

              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="text-[var(--color-muted)]">
                {item.text}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}