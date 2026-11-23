import { CircleCheck, CircleQuestionMark, CircleX, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Decision } from "@/types/preferences";

// Record<Decision, …> forces an entry for EVERY decision: if a fourth
// decision is ever added to the type, this file stops compiling until it
// gets a chip. The compiler becomes a checklist.
const CHIPS: Record<Decision, { label: string; icon: LucideIcon; className: string }> = {
  LIKE: {
    label: "Liked",
    icon: CircleCheck,
    className: "border-like-border bg-like-surface text-like-foreground",
  },
  DISLIKE: {
    label: "Disliked",
    icon: CircleX,
    className: "border-dislike-border bg-dislike-surface text-dislike-foreground",
  },
  NOT_SURE: {
    label: "Not sure",
    icon: CircleQuestionMark,
    className: "border-unsure-border bg-unsure-surface text-unsure-foreground",
  },
};

export function DecisionChip({ decision, className }: { decision: Decision; className?: string }) {
  const { label, icon: Icon, className: tone } = CHIPS[decision];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-label-md",
        tone,
        className,
      )}
    >
      {/* Icon + text: colour is never the ONLY signal (colour-blind users). */}
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
