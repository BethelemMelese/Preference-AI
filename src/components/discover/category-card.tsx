import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { CategoryIcon } from "@/components/shared/category-icon";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryProgress, CategoryStatus } from "@/types/preferences";

const STATUS: Record<CategoryStatus, { label: string; badge: string; action: string }> = {
  UNEXPLORED: {
    label: "Not started",
    badge: "bg-surface-container text-muted-foreground",
    action: "Start",
  },
  IN_PROGRESS: {
    label: "In progress",
    badge: "bg-primary-soft text-primary-soft-foreground",
    action: "Continue",
  },
  COMPLETED: {
    label: "Completed",
    badge: "bg-complete-surface text-complete-foreground",
    action: "Review",
  },
};

/** One category on the Discover page. The whole flow starts here. */
export function CategoryCard({ progress }: { progress: CategoryProgress }) {
  const { category, status, decidedCount, totalItems, percent } = progress;
  const config = STATUS[status];

  return (
    <article className="flex h-full flex-col rounded-xl border border-border/60 bg-card p-5 shadow-tier-1">
      <div className="flex items-start justify-between gap-3">
        <CategoryIcon slug={category.slug} />
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-sm uppercase",
            config.badge,
          )}
        >
          {status === "COMPLETED" && <Check className="size-3" aria-hidden />}
          {config.label}
        </span>
      </div>

      <h2 className="mt-4 text-headline-sm">{category.name}</h2>
      <p className="mt-1 line-clamp-2 text-body-md text-muted-foreground">{category.description}</p>

      <div className="mt-auto pt-5">
        <div className="mb-2 flex justify-between text-body-sm text-muted-foreground">
          <span>
            {decidedCount} / {totalItems} rated
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar
          value={percent}
          label={`${category.name} progress`}
          tone={status === "COMPLETED" ? "complete" : "primary"}
        />
        <Button
          asChild
          variant={status === "IN_PROGRESS" ? "default" : "outline"}
          className="mt-4 h-10 w-full rounded-full"
        >
          <Link href={`/discover/${category.slug}`}>
            {config.action}
            {/* Screen readers hear "Continue Food & Drinks", not 10× "Continue" */}
            <span className="sr-only"> {category.name}</span>
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  );
}
