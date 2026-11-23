import Link from "next/link";
import { ArrowRight, ListChecks, MousePointerClick, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: MousePointerClick, title: "Pick a category", text: "Food, travel, hobbies, work… ten to choose from." },
  { icon: ListChecks, title: "Rate items", text: "Like, dislike, or not sure. Skip anything, change anything." },
  { icon: Sparkles, title: "Get insights", text: "The AI suggests ideas and writes a report from your answers." },
];

/** Home for a brand-new user (zero decisions): one clear next step. */
export function GettingStarted() {
  return (
    <div className="mx-auto max-w-3xl py-6 text-center md:py-12">
      <Logo size={64} showWordmark={false} className="justify-center" />
      <h1 className="mt-6 text-display-lg-mobile md:text-display-lg">Discover what you really like</h1>
      <p className="mx-auto mt-3 max-w-xl text-body-lg text-muted-foreground">
        Rate a few things, and PreferenceAI helps you see your own patterns. Your answers stay the
        source of truth; the AI only interprets them.
      </p>

      <ol className="mt-10 grid gap-4 text-left sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-xl border border-border/60 bg-card p-5 shadow-tier-1">
            <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground" aria-hidden>
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-headline-sm">
              {i + 1}. {title}
            </h2>
            <p className="mt-1 text-body-md text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>

      <Button asChild size="lg" className="mt-10 h-12 rounded-full px-8 text-body-lg">
        <Link href="/discover">
          Start discovering <ArrowRight aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
