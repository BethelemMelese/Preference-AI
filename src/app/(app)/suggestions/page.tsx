import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";

import { Panel } from "@/components/shared/panel";
import { PageHeader } from "@/components/shared/page-header";
import { SoonButton } from "@/components/shared/soon-button";
import { SourceBadge } from "@/components/shared/source-badge";
import { SuggestionBoard, type SuggestionView } from "@/components/suggestions/suggestion-board";
import { sampleCategories, sampleItems, samplePreferences, sampleSuggestions } from "@/lib/sample-data";

export const metadata: Metadata = { title: "For You · PreferenceAI" };

export default function SuggestionsPage() {
  // Join each suggestion with its category and the decisions it was based
  // on, here on the server, so the client receives ready-to-render data.
  const categoriesById = new Map(sampleCategories.map((c) => [c.id, c]));
  const itemsById = new Map(sampleItems.map((i) => [i.id, i]));
  const decisionByItemId = new Map(samplePreferences.map((p) => [p.itemId, p.decision]));

  const suggestions: SuggestionView[] = sampleSuggestions.flatMap((s) => {
    const category = categoriesById.get(s.categoryId);
    if (!category) return [];
    return [
      {
        id: s.id,
        title: s.title,
        description: s.description,
        reasoning: s.reasoning,
        status: s.status,
        category: { name: category.name, slug: category.slug },
        // Only show "based on" items the user ACTUALLY decided on.
        basedOn: s.basedOnItemIds.flatMap((itemId) => {
          const item = itemsById.get(itemId);
          const decision = decisionByItemId.get(itemId);
          return item && decision ? [{ itemId, name: item.name, decision }] : [];
        }),
      },
    ];
  });

  const likes = samplePreferences.filter((p) => p.decision === "LIKE").length;
  const dislikes = samplePreferences.filter((p) => p.decision === "DISLIKE").length;

  return (
    <>
      <PageHeader
        title="For you"
        description="Ideas the AI picked from your answers. Nothing here counts as your preference until you rate it yourself."
        actions={
          <SoonButton>
            <RefreshCw aria-hidden /> Get new ideas
          </SoonButton>
        }
      />

      <Panel className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-headline-sm">How these were chosen</h2>
          <SourceBadge source="ai" />
        </div>
        <p className="mt-2 text-body-md text-muted-foreground">
          Based on your {likes} likes and {dislikes} dislikes. Ideas similar to things you disliked are
          avoided, and “Not sure” answers are treated as open questions, not dislikes.{" "}
          <span className="text-foreground">“Add to Discover”</span> puts an idea into its category
          unrated, so you decide later whether you like it.
        </p>
      </Panel>

      <SuggestionBoard initialSuggestions={suggestions} />
    </>
  );
}
