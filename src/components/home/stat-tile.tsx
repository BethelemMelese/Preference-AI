import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Colour classes for the icon bubble. */
  tone: string;
  hint?: string;
};

/** One simple number with a label. Deliberately plain: users scan these
 *  in a second, so no charts or trends. */
export function StatTile({ label, value, icon: Icon, tone, hint }: StatTileProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-tier-1 md:p-5">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", tone)} aria-hidden>
          <Icon className="size-[18px]" />
        </span>
        <span className="text-body-md text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 font-heading text-headline-lg">{value}</p>
      {hint && <p className="mt-1 text-body-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
