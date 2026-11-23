// This is a Server Component (the default in the App Router).
// It renders to HTML on the server and ships no JavaScript of its own.
// Placeholder: a brand-token test page (logo, type scale, chips, card).
// Replaced by the dashboard design in Phase 2.

import Link from "next/link";
import { CircleQuestionMark, ThumbsDown, ThumbsUp } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <Logo size={56} showWordmark={false} />

      {/* Responsive type tokens: mobile size first, desktop from md: */}
      <h1 className="text-display-lg-mobile md:text-display-lg">
        Discover what you really like.
      </h1>

      <p className="text-body-lg text-muted-foreground">
        Explore categories, record your likes and dislikes, and get an
        AI-written report built only on the choices you actually made.
      </p>

      {/* Tier 1 card + the three preference chips from DESIGN.md */}
      <div className="flex w-full flex-col items-center gap-4 rounded-xl border bg-card p-6 shadow-tier-1">
        <span className="text-label-sm uppercase text-muted-foreground">
          Preference states
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-like-border bg-like-surface px-3 py-1 text-label-md text-like-foreground">
            <ThumbsUp className="size-3.5" aria-hidden /> Like
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-dislike-border bg-dislike-surface px-3 py-1 text-label-md text-dislike-foreground">
            <ThumbsDown className="size-3.5" aria-hidden /> Dislike
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-unsure-border bg-unsure-surface px-3 py-1 text-label-md text-unsure-foreground">
            <CircleQuestionMark className="size-3.5" aria-hidden /> Not sure
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" disabled>
          Start discovering
        </Button>
        {/* asChild: Button renders NO <button>; it merges its styles onto
            its single child, so the output is ONE element: <a href="/about"> */}
        <Button asChild variant="ghost" size="lg">
          <Link href="/about">Learn more</Link>
        </Button>
      </div>
    </main>
  );
}
