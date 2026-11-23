import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DiscoveryDeck, type RecordedAnswer } from "@/components/discover/discovery-deck";
import { sampleCategories, sampleItems, samplePreferences } from "@/lib/sample-data";

// [slug] = dynamic segment: /discover/food-drinks → params.slug = "food-drinks".

function findCategory(slug: string) {
  return sampleCategories.find((category) => category.slug === slug);
}

// The 10 categories are known at build time, so each page is prerendered.
//
// Unknown slugs: Next 16 enables Cache Components by default, which forbids
// `dynamicParams = false`. Unlisted slugs are rendered on request, and
// notFound() below shows the 404 page. Because the loading.tsx boundary has
// already started streaming by then, the HTTP status stays 200 and Next
// adds <meta name="robots" content="noindex">. Accepted trade-off: users see
// the right page, and this personal app isn't meant for search engines.
export function generateStaticParams() {
  return sampleCategories.map((category) => ({ slug: category.slug }));
}

// Per-page <title>, e.g. "Food & Drinks · PreferenceAI".
export async function generateMetadata({ params }: PageProps<"/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findCategory(slug)?.name ?? "Category"} · PreferenceAI` };
}

export default async function CategoryDiscoveryPage({ params }: PageProps<"/discover/[slug]">) {
  const { slug } = await params;
  const category = findCategory(slug);
  // Unknown slug → the 404 page, instead of crashing on `undefined`.
  if (!category) notFound();

  // The SERVER prepares exactly what the deck needs; the client component
  // receives plain serialisable data (no functions, no Date objects).
  const items = sampleItems.filter((item) => item.categoryId === category.id);
  const itemIds = new Set(items.map((item) => item.id));
  const initialAnswers: Record<string, RecordedAnswer> = Object.fromEntries(
    samplePreferences
      .filter((pref) => itemIds.has(pref.itemId))
      .map((pref) => [pref.itemId, { decision: pref.decision, explanation: pref.explanation }]),
  );

  // key={category.id}: moving to another category gives a FRESH deck
  // (React resets all state when a component's key changes).
  return <DiscoveryDeck key={category.id} category={category} items={items} initialAnswers={initialAnswers} />;
}
