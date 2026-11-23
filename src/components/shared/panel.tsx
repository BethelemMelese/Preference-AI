import { cn } from "@/lib/utils";

/** The standard card surface (DESIGN.md Tier 1): white card, hairline
 *  border, soft shadow, 16px radius. One component = one source of truth
 *  for the card look across every page. */
export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-xl border border-border/60 bg-card p-5 shadow-tier-1 md:p-6", className)}
      {...props}
    >
      {children}
    </section>
  );
}
