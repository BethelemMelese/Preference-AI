import Link from "next/link";

import { cn } from "@/lib/utils";

export type FilterTab = { label: string; href: string; count: number; active: boolean };

/** Filters as LINKS (state in the URL, e.g. /discover?status=completed)
 *  instead of React state: bookmarkable, shareable, Back button works,
 *  and no client JavaScript needed. Scrolls sideways on narrow screens. */
export function FilterTabs({ tabs, label }: { tabs: FilterTab[]; label: string }) {
  return (
    <nav aria-label={label} className="-mx-4 mb-6 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex w-max gap-2">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              // scroll={false}: switching filters shouldn't jump to the top
              scroll={false}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-body-md transition-colors",
                tab.active
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-accent",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-label-sm",
                  tab.active ? "bg-primary-foreground/20" : "bg-surface-container text-muted-foreground",
                )}
              >
                {tab.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
