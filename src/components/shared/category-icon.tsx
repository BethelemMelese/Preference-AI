import {
  Briefcase,
  Brush,
  Clapperboard,
  Cpu,
  GraduationCap,
  Palette,
  Plane,
  Sunrise,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types/preferences";

// The database stores the slug (a string). The UI maps it to an icon here,
// so the database never stores UI details like component names.
const ICONS: Record<CategorySlug, LucideIcon> = {
  "food-drinks": Utensils,
  entertainment: Clapperboard,
  hobbies: Palette,
  lifestyle: Sunrise,
  "work-career": Briefcase,
  travel: Plane,
  technology: Cpu,
  learning: GraduationCap,
  social: Users,
  creativity: Brush,
};

type CategoryIconProps = {
  slug: CategorySlug;
  /** "circle" = dashboard/category cards, "square" = list rows. */
  shape?: "circle" | "square";
  className?: string;
};

/** Category icon inside a tinted bubble. Decorative: the category name is
 *  always shown next to it, so it's hidden from screen readers. */
export function CategoryIcon({ slug, shape = "circle", className }: CategoryIconProps) {
  const Icon = ICONS[slug];
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center bg-surface-container text-primary",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
