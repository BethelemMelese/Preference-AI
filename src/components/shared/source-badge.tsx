import { CircleCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

/** THE business-rule component: every block of content says where it came
 *  from. "Your choices" = facts from recorded decisions. "AI-generated" =
 *  interpretation, which may be wrong and never changes those decisions. */
export function SourceBadge({ source, className }: { source: "user" | "ai"; className?: string }) {
  const isAI = source === "ai";
  const Icon = isAI ? Sparkles : CircleCheck;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-sm uppercase",
        isAI
          ? "bg-primary-soft text-primary-soft-foreground"
          : "bg-surface-container text-foreground",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {isAI ? "AI-generated" : "Your choices"}
    </span>
  );
}
