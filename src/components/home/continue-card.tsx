import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryIcon } from "@/components/shared/category-icon";
import { ProgressBar } from "@/components/shared/progress-bar";
import type { CategoryProgress } from "@/types/preferences";

/** A compact, fully clickable "pick up where you left off" card. The whole
 *  card is ONE link: a single, large tap target and no nested links. */
export function ContinueCard({ progress }: { progress: CategoryProgress }) {
  const { category, decidedCount, totalItems, percent } = progress;
  return (
    <Link
      href={`/discover/${category.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border/60 bg-card p-5 shadow-tier-1 transition-shadow outline-none hover:shadow-tier-2 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center gap-3">
        <CategoryIcon slug={category.slug} className="size-10" />
        <h3 className="min-w-0 flex-1 truncate text-headline-sm">{category.name}</h3>
        <ArrowRight
          className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
      <ProgressBar className="mt-5" value={percent} label={`${category.name} progress`} />
      <p className="mt-2 text-body-sm text-muted-foreground">
        {decidedCount} of {totalItems} rated · {totalItems - decidedCount} left
      </p>
    </Link>
  );
}
