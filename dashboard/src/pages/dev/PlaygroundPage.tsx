import { Plus, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] p-12">
      <div className="flex flex-wrap gap-6">
        <Button>Primary</Button>

        <Button variant="secondary">
          Secondary
        </Button>

        <Button variant="outline">
          Outline
        </Button>

        <Button variant="ghost">
          Ghost
        </Button>

        <Button variant="danger">
          Delete
        </Button>

        <Button loading>
          Saving...
        </Button>

        <Button leftIcon={<Plus size={18} />}>
          Create Course
        </Button>

        <Button rightIcon={<ArrowRight size={18} />}>
          Continue
        </Button>
      </div>
      <div className="mt-10 w-[400px] space-y-4">
        <Input placeholder="Email manzilingiz" />

        <Input
            variant="error"
            placeholder="Noto'g'ri email"
        />

        <Input
            variant="success"
            placeholder="To'g'ri email"
        />
        </div>
        <div className="mt-12 max-w-md">
  <Card>
    <CardHeader>
      <CardTitle>React Bootcamp</CardTitle>

      <CardDescription>
        Zamonaviy React va TypeScript kursi.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <p className="text-sm text-[var(--color-text)]">
        48 ta dars • 12 ta test • Sertifikat mavjud
      </p>
    </CardContent>

    <CardFooter>
      <Button>Davom etish</Button>
    </CardFooter>
  </Card>
</div>
    </main>
  );
}