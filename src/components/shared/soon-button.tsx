import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** An AI action that exists in the design but needs OpenAI (Phases 4–7).
 *  Shown disabled with a "Soon" tag so the layout is final, and nobody
 *  clicks a button that silently does nothing. */
export function SoonButton({
  children,
  className,
  variant = "outline",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  return (
    <Button variant={variant} disabled className={cn("h-10 rounded-full px-4", className)}>
      {children}
      <span className="rounded-full bg-primary-soft px-1.5 py-px text-label-sm text-primary-soft-foreground">
        Soon
      </span>
    </Button>
  );
}
