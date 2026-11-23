// =============================================================================
// Pure functions that DERIVE statistics from raw data.
//
// "Pure" = same input → same output, no side effects, no database, no
// Date.now() inside (the current time is passed in as `now`). That makes
// them trivial to unit-test in Phase 8 and reusable when the data comes
// from PostgreSQL instead of sample-data.ts.
// =============================================================================

import type {
  Category,
  CategoryDecisionSummary,
  CategoryProgress,
  Decision,
  CategoryStatus,
  DecisionWithItem,
  PreferenceItem,
  UserPreference,
} from "@/types/preferences";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Progress for every category, in display (sortOrder) order. */
export function getCategoryProgress(
  categories: Category[],
  items: PreferenceItem[],
  preferences: UserPreference[],
): CategoryProgress[] {
  // Build lookups once (O(n)) instead of searching arrays inside loops.
  const categoryIdByItemId = new Map(items.map((item) => [item.id, item.categoryId]));

  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const totalItems = items.filter((item) => item.categoryId === category.id).length;
      const decided = preferences.filter(
        (pref) => categoryIdByItemId.get(pref.itemId) === category.id,
      );
      // ISO-8601 strings sort chronologically as plain text.
      const dates = decided.map((pref) => pref.createdAt).sort();

      return {
        category,
        totalItems,
        decidedCount: decided.length,
        percent: totalItems === 0 ? 0 : Math.round((decided.length / totalItems) * 100),
        status: getStatus(decided.length, totalItems),
        firstActivityAt: dates[0] ?? null,
        lastActivityAt: dates.at(-1) ?? null,
      };
    });
}

function getStatus(decided: number, total: number): CategoryStatus {
  if (decided === 0) return "UNEXPLORED";
  if (decided >= total) return "COMPLETED";
  return "IN_PROGRESS";
}

export type DashboardStats = {
  totalCategories: number;
  categoriesExplored: number;
  unexploredCount: number;
  newCategoriesThisWeek: number;
  likes: number;
  dislikes: number;
  notSure: number;
  newLikesThisWeek: number;
  totalDecisions: number;
  totalItems: number;
  /** Share of all available items the user has decided on, 0–100. */
  overallPercent: number;
};

export function getDashboardStats(
  progress: CategoryProgress[],
  preferences: UserPreference[],
  now: Date,
): DashboardStats {
  const weekAgo = now.getTime() - WEEK_MS;
  const isThisWeek = (iso: string | null) => iso !== null && Date.parse(iso) > weekAgo;

  const count = (decision: UserPreference["decision"]) =>
    preferences.filter((pref) => pref.decision === decision).length;

  const totalItems = progress.reduce((sum, p) => sum + p.totalItems, 0);
  const explored = progress.filter((p) => p.status !== "UNEXPLORED");

  return {
    totalCategories: progress.length,
    categoriesExplored: explored.length,
    unexploredCount: progress.length - explored.length,
    newCategoriesThisWeek: explored.filter((p) => isThisWeek(p.firstActivityAt)).length,
    likes: count("LIKE"),
    dislikes: count("DISLIKE"),
    notSure: count("NOT_SURE"),
    newLikesThisWeek: preferences.filter(
      (pref) => pref.decision === "LIKE" && isThisWeek(pref.createdAt),
    ).length,
    totalDecisions: preferences.length,
    totalItems,
    overallPercent: totalItems === 0 ? 0 : Math.round((preferences.length / totalItems) * 100),
  };
}

/** In-progress categories, most recently active first. */
export function getActiveCategories(progress: CategoryProgress[]): CategoryProgress[] {
  return progress
    .filter((p) => p.status === "IN_PROGRESS")
    .sort((a, b) => (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? ""));
}

/** The latest decisions, joined with their item and category. */
export function getRecentDecisions(
  preferences: UserPreference[],
  items: PreferenceItem[],
  categories: Category[],
  limit: number,
): DecisionWithItem[] {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return [...preferences]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .flatMap((preference) => {
      const item = itemsById.get(preference.itemId);
      const category = item && categoriesById.get(item.categoryId);
      // Skip orphaned rows instead of crashing the whole page.
      return item && category ? [{ preference, item, category }] : [];
    });
}

/** Like/dislike/not-sure counts per category, strongest (most likes) first.
 *  Categories without any decision are left out. */
export function getStrongestCategories(
  categories: Category[],
  items: PreferenceItem[],
  preferences: UserPreference[],
): CategoryDecisionSummary[] {
  const categoryIdByItemId = new Map(items.map((item) => [item.id, item.categoryId]));
  const byCategory = new Map(
    categories.map((category) => [category.id, { category, likes: 0, dislikes: 0, notSure: 0 }]),
  );

  for (const pref of preferences) {
    const summary = byCategory.get(categoryIdByItemId.get(pref.itemId) ?? "");
    if (!summary) continue;
    if (pref.decision === "LIKE") summary.likes++;
    else if (pref.decision === "DISLIKE") summary.dislikes++;
    else summary.notSure++;
  }

  return [...byCategory.values()]
    .filter((s) => s.likes + s.dislikes + s.notSure > 0)
    .sort((a, b) => b.likes - a.likes || a.dislikes - b.dislikes);
}

/** Item names grouped by decision: the factual part of a report. */
export function groupItemsByDecision(
  items: PreferenceItem[],
  preferences: UserPreference[],
): Record<Decision, PreferenceItem[]> {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const groups: Record<Decision, PreferenceItem[]> = { LIKE: [], DISLIKE: [], NOT_SURE: [] };
  for (const pref of preferences) {
    const item = itemsById.get(pref.itemId);
    if (item) groups[pref.decision].push(item);
  }
  return groups;
}

/** Categories with too few decisions for the AI to say anything meaningful.
 *  Module 6 asks us to flag "areas with insufficient information". */
export function getLowCoverageCategories(
  progress: CategoryProgress[],
  minDecisions = 3,
): CategoryProgress[] {
  return progress.filter((p) => p.decidedCount < minDecisions);
}
