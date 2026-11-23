import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { DesktopNavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

/** Header on every screen size. Desktop: logo + 5 links + theme toggle.
 *  Mobile: logo + theme toggle (navigation moves to the bottom bar). */
export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-6">
        <Link href="/" className="shrink-0 rounded-lg" aria-label="PreferenceAI home">
          <Logo size={30} />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <DesktopNavLinks />
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
