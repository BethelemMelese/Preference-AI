"use client";
// Client Component because usePathname() reads the CURRENT URL, which
// changes during client-side navigation.
//
// Why the <Suspense>: the header lives in the layout, which Next prerenders
// as a static shell shared by every page. On a dynamic route such as
// /discover/[slug], the exact path isn't known at build time, so
// usePathname() can't run during prerendering. Suspense lets the shell
// include a FALLBACK: the same links without the active highlight. The
// highlight fills in at request time, with no layout shift.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-config";

function isActive(pathname: string | null, href: string): boolean {
  if (pathname === null) return false; // fallback render: nothing highlighted
  // "/" must match exactly, or Home would be "active" on every page.
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ── Presentational lists: no hooks, so they can render as fallbacks ──────

function DesktopList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {NAV_ITEMS.map(({ label, href }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-body-md transition-colors",
                active
                  ? "bg-primary-soft font-medium text-primary-soft-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="grid grid-cols-5">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-1 py-2.5 text-center text-label-sm",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {/* "My Preferences" is too long for a phone tab */}
              {label === "My Preferences" ? "Preferences" : label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// ── Hook wrappers: read the URL, then render the list ────────────────────

function ActiveDesktopList() {
  return <DesktopList pathname={usePathname()} />;
}

function ActiveMobileList() {
  return <MobileList pathname={usePathname()} />;
}

/** Horizontal links in the desktop header (md and up). */
export function DesktopNavLinks() {
  return (
    <Suspense fallback={<DesktopList pathname={null} />}>
      <ActiveDesktopList />
    </Suspense>
  );
}

/** Icon tabs in the mobile bottom bar (below md). */
export function MobileNavLinks() {
  return (
    <Suspense fallback={<MobileList pathname={null} />}>
      <ActiveMobileList />
    </Suspense>
  );
}
