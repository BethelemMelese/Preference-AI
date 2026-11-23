import type { Metadata } from "next";

import { CategoryCard } from "@/components/discover/category-card";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressBar } from "@/components/shared/progress-bar";
import { getCategoryProgress, getDashboardStats } from "@/lib/preferences/stats";
import { sampleCategories, sampleItems, samplePreferences } from "@/lib/sample-data";
import type { CategoryStatus } from "@/types/preferences";

export const metadata: Metadata = { title: "Discover · PreferenceAI" };

// URL value → status. Anything unknown falls back to "all".
const FILTERS: { param: string; label: string; status: CategoryStatus | null }[] = [
  { param: "all", label: "All", status: null },
  { param: "in-progress", label: "In progress", status: "IN_PROGRESS" },
  { param: "not-started", label: "Not started", status: "UNEXPLORED" },
  { param: "completed", label: "Completed", status: "COMPLETED" },
];

export default async function DiscoverPage({ searchParams }: PageProps<"/discover">) {
  // In Next 16, searchParams is a Promise: the page waits for the request.
  const { status } = await searchParams;
  const active = FILTERS.find((f) => f.param === status) ?? FILTERS[0];

  const progress = getCategoryProgress(sampleCategories, sampleItems, samplePreferences);
  const stats = getDashboardStats(progress, samplePreferences, new Date());
  const visible = active.status ? progress.filter((p) => p.status === active.status) : progress;

  const tabs = FILTERS.map((f) => ({
    label: f.label,
    href: f.param === "all" ? "/discover" : `/discover?status=${f.param}`,
    count: f.status ? progress.filter((p) => p.status === f.status).length : progress.length,
    active: f === active,
  }));

  return (
    <>
      <PageHeader
        title="Discover"
        description="Pick a category and rate items one at a time. There are no wrong answers, and “Not sure” is always fine."
        actions={
          <div className="w-full min-w-56 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-tier-1 md:w-auto">
            <p className="text-body-sm text-muted-foreground">
              {stats.totalDecisions} of {stats.totalItems} items rated
            </p>
            <ProgressBar className="mt-2" value={stats.overallPercent} label="Overall progress" />
          </div>
        }
      />

      <FilterTabs tabs={tabs} label="Filter categories" />

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-body-md text-muted-foreground">
          No categories here yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.category.id}>
              <CategoryCard progress={p} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
