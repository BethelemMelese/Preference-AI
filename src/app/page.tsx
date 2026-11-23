// This is a Server Component (the default in the App Router).
// It renders to HTML on the server and ships no JavaScript of its own.
// Phase 1 placeholder: it only proves Tailwind + shadcn + Lucide work together.
// The real dashboard replaces this in Phase 2.

import {
  CircleQuestionMark,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sparkles className="size-5" aria-hidden />
        <span className="text-sm font-medium">PreferenceAI</span>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight">
        Discover what you really like.
      </h1>

      <p className="text-lg text-muted-foreground">
        Explore categories, record your likes and dislikes, and get an
        AI-written report built only on the choices you actually made.
      </p>

      {/* Static preview of the three decisions. Not interactive yet. */}
      <div className="flex gap-3" aria-label="Decision options preview">
        <Button variant="outline" size="lg" disabled>
          <ThumbsUp /> Like
        </Button>
        <Button variant="outline" size="lg" disabled>
          <ThumbsDown /> Dislike
        </Button>
        <Button variant="outline" size="lg" disabled>
          <CircleQuestionMark /> Not sure
        </Button>
      </div>

      {/* asChild: Button renders NO <button>; it merges its styles onto
          its single child, so the output is ONE element: <a href="/about"> */}
      <Button asChild variant="link" size="sm">
        <Link href="/about">Learn more about PreferenceAI</Link>
      </Button>

      <p className="text-xs text-muted-foreground">
        Phase 1 setup complete — the dashboard arrives in Phase 2.
      </p>
    </main>
  );
}
