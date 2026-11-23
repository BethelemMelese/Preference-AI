import { CategoryIcon } from "@/components/shared/category-icon";
import { Panel } from "@/components/shared/panel";
import { SourceBadge } from "@/components/shared/source-badge";
import { cn } from "@/lib/utils";
import type { CategoryDecisionSummary, CategoryProgress, Decision, PreferenceItem } from "@/types/preferences";

type FactsPanelProps = {
  strongest: CategoryDecisionSummary[];
  groups: Record<Decision, PreferenceItem[]>;
  lowCoverage: CategoryProgress[];
};

const GROUPS: { decision: Decision; title: string; tone: string }[] = [
  { decision: "LIKE", title: "Things you like", tone: "border-like-border bg-like-surface text-like-foreground" },
  { decision: "DISLIKE", title: "Things you dislike", tone: "border-dislike-border bg-dislike-surface text-dislike-foreground" },
  { decision: "NOT_SURE", title: "Not sure yet", tone: "border-unsure-border bg-unsure-surface text-unsure-foreground" },
];

/** FACTS: calculated directly from recorded decisions. No AI involved, so
 *  this panel is always accurate and always current. */
export function FactsPanel({ strongest, groups, lowCoverage }: FactsPanelProps) {
  return (
    <Panel aria-labelledby="facts-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="facts-heading" className="text-headline-md">
          What your answers show
        </h2>
        <SourceBadge source="user" />
      </div>

      <h3 className="mt-6 text-headline-sm">Strongest categories</h3>
      <ol className="mt-3 space-y-2">
        {strongest.slice(0, 3).map(({ category, likes, dislikes, notSure }) => (
          <li key={category.id} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
            <CategoryIcon slug={category.slug} className="size-9" />
            <span className="min-w-0 flex-1 truncate text-body-md font-medium">{category.name}</span>
            <span className="text-body-sm text-muted-foreground">
              <span className="text-like-foreground">{likes} liked</span> · {dislikes} disliked · {notSure} not sure
            </span>
          </li>
        ))}
      </ol>

      {GROUPS.map(({ decision, title, tone }) => (
        <div key={decision}>
          <h3 className="mt-6 text-headline-sm">
            {title} <span className="text-body-md font-normal text-muted-foreground">({groups[decision].length})</span>
          </h3>
          {groups[decision].length === 0 ? (
            <p className="mt-2 text-body-md text-muted-foreground">Nothing yet.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {groups[decision].map((item) => (
                <li key={item.id} className={cn("rounded-full border px-2.5 py-0.5 text-label-md", tone)}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {lowCoverage.length > 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-border p-4">
          <h3 className="text-label-md">Not enough information yet</h3>
          <p className="mt-1 text-body-md text-muted-foreground">
            Fewer than 3 answers in: {lowCoverage.map((p) => p.category.name).join(", ")}. Rating a few
            items there makes future reports more accurate.
          </p>
        </div>
      )}
    </Panel>
  );
}
