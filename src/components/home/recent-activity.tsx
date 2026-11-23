import Link from "next/link";

import { CategoryIcon } from "@/components/shared/category-icon";
import { DecisionChip } from "@/components/shared/decision-chip";
import { Panel } from "@/components/shared/panel";
import { formatRelativeDay } from "@/lib/format";
import type { DecisionWithItem } from "@/types/preferences";

export function RecentActivity({ decisions, now }: { decisions: DecisionWithItem[]; now: Date }) {
  return (
    <Panel aria-labelledby="recent-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="recent-heading" className="text-headline-sm">
          Recent activity
        </h2>
        <Link href="/preferences" className="text-label-md text-primary hover:underline">
          View all
        </Link>
      </div>

      <ul className="mt-2 divide-y divide-border/60">
        {decisions.map(({ preference, item, category }) => (
          <li key={preference.id} className="flex items-center gap-3 py-3.5">
            <CategoryIcon slug={category.slug} shape="square" className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-md font-medium">{item.name}</p>
              <p className="truncate text-body-sm text-muted-foreground">
                {category.name} ·{" "}
                {/* <time> gives machines the exact date; people read "yesterday" */}
                <time dateTime={preference.updatedAt}>{formatRelativeDay(preference.updatedAt, now)}</time>
              </p>
            </div>
            <DecisionChip decision={preference.decision} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
