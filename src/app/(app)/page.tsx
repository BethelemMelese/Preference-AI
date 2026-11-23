import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, CircleQuestionMark, Shapes, ThumbsDown, ThumbsUp } from "lucide-react";

import { ContinueCard } from "@/components/home/continue-card";
import { GettingStarted } from "@/components/home/getting-started";
import { LatestInsight } from "@/components/home/latest-insight";
import { RecentActivity } from "@/components/home/recent-activity";
import { StatTile } from "@/components/home/stat-tile";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import {
  getActiveCategories,
  getCategoryProgress,
  getDashboardStats,
  getRecentDecisions,
} from "@/lib/preferences/stats";
import {
  sampleCategories,
  sampleItems,
  samplePreferences,
  sampleReports,
  sampleUser,
} from "@/lib/sample-data";

export const metadata: Metadata = { title: "Home · PreferenceAI" };

export default async function HomePage() {
  // Render per REQUEST: "yesterday" depends on the current moment, and in
  // Phase 3 this page reads the user's cookie. (Next 16 won't freeze
  // new Date() into a static page.)
  await connection();
  const now = new Date();

  // Phase 2: sample data. Phase 3: the same arrays come from PostgreSQL.
  const progress = getCategoryProgress(sampleCategories, sampleItems, samplePreferences);
  const stats = getDashboardStats(progress, samplePreferences, now);

  // Brand-new user → one clear next step, nothing else.
  if (stats.totalDecisions === 0) return <GettingStarted />;

  const active = getActiveCategories(progress);
  const next = active[0];
  const recent = getRecentDecisions(samplePreferences, sampleItems, sampleCategories, 5);
  const latestReport = sampleReports[0];

  return (
    <div className="space-y-10">
      {/* ── 1. Where was I? ───────────────────────────────────── */}
      <section className="rounded-2xl border border-border/60 bg-linear-to-br from-primary-soft/80 via-card to-card p-6 shadow-tier-1 md:p-8">
        <h1 className="text-headline-lg-mobile md:text-display-lg">
          {sampleUser.name ? `Welcome back, ${sampleUser.name}` : "Welcome back"}
        </h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          You have rated {stats.totalDecisions} of {stats.totalItems} items across{" "}
          {stats.categoriesExplored} categories.
        </p>
        <ProgressBar className="mt-5 max-w-md" value={stats.overallPercent} label="Overall progress" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-full px-6">
            <Link href={next ? `/discover/${next.category.slug}` : "/discover"}>
              {next ? `Continue: ${next.category.name}` : "Explore a new category"}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-card px-6">
            <Link href="/discover">Browse all categories</Link>
          </Button>
        </div>
      </section>

      {/* ── 2. How far am I? (Module 1 totals) ────────────────── */}
      <section aria-label="Your totals" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Likes"
          value={stats.likes}
          icon={ThumbsUp}
          tone="bg-like-surface text-like-foreground"
          hint={stats.newLikesThisWeek > 0 ? `+${stats.newLikesThisWeek} this week` : undefined}
        />
        <StatTile
          label="Dislikes"
          value={stats.dislikes}
          icon={ThumbsDown}
          tone="bg-dislike-surface text-dislike-foreground"
        />
        <StatTile
          label="Not sure"
          value={stats.notSure}
          icon={CircleQuestionMark}
          tone="bg-unsure-surface text-unsure-foreground"
          hint="Never counted as a dislike"
        />
        <StatTile
          label="Categories"
          value={`${stats.categoriesExplored}/${stats.totalCategories}`}
          icon={Shapes}
          tone="bg-primary-soft text-primary-soft-foreground"
          hint={`${stats.unexploredCount} not started`}
        />
      </section>

      {/* ── 3. Keep going ─────────────────────────────────────── */}
      {active.length > 0 && (
        <section aria-labelledby="continue-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="continue-heading" className="text-headline-md">
              Continue exploring
            </h2>
            <Link href="/discover?status=in-progress" className="text-label-md text-primary hover:underline">
              See all {active.length}
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.slice(0, 3).map((p) => (
              <li key={p.category.id}>
                <ContinueCard progress={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 4. What has the AI noticed? + what did I do? ──────── */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <LatestInsight report={latestReport} totalDecisions={stats.totalDecisions} now={now} />
        <RecentActivity decisions={recent} now={now} />
      </div>
    </div>
  );
}
