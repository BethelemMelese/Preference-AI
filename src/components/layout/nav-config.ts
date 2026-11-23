import { ChartSpline, Compass, House, SlidersHorizontal, Sparkles, type LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

// Five destinations, one per thing the user actually does. The SAME list
// drives the desktop top bar and the mobile bottom bar, so the app works
// the same way on every screen size.
//
// Why this file is imported by the CLIENT component (nav-links.tsx) instead
// of passed as a prop from the server: icons are React components, i.e.
// functions, and functions can't be sent from Server to Client Components.
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "For You", href: "/suggestions", icon: Sparkles },
  { label: "Insights", href: "/insights", icon: ChartSpline },
  { label: "My Preferences", href: "/preferences", icon: SlidersHorizontal },
];
