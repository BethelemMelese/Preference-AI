import type { Metadata } from "next";
import { connection } from "next/server";

import { PreferenceManager, type PreferenceRow } from "@/components/preferences/preference-manager";
import { PageHeader } from "@/components/shared/page-header";
import { formatRelativeDay } from "@/lib/format";
import { getRecentDecisions } from "@/lib/preferences/stats";
import { sampleCategories, sampleItems, samplePreferences } from "@/lib/sample-data";

export const metadata: Metadata = { title: "My Preferences · PreferenceAI" };

export default async function PreferencesPage() {
  await connection(); // date labels depend on "now"
  const now = new Date();

  // Newest first, joined with item + category, then flattened into plain
  // rows. Dates are formatted HERE so server and browser show the same text.
  const rows: PreferenceRow[] = getRecentDecisions(
    samplePreferences,
    sampleItems,
    sampleCategories,
    samplePreferences.length,
  ).map(({ preference, item, category }) => ({
    id: preference.id,
    itemName: item.name,
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    decision: preference.decision,
    explanation: preference.explanation,
    dateLabel: formatRelativeDay(preference.updatedAt, now),
  }));

  return (
    <>
      <PageHeader
        title="My preferences"
        description="Everything you have answered. These are your choices; the AI only reads them, and never changes them."
      />
      <PreferenceManager
        initialRows={rows}
        categories={sampleCategories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </>
  );
}
