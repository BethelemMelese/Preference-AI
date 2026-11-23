import { MobileNavLinks } from "./nav-links";

/** Bottom tab bar on phones/tablets (hidden from md up, where the header
 *  shows the links). display:none also removes it from the accessibility
 *  tree, so screen readers only ever hear one "Main" navigation. */
export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      // safe-area padding keeps the tabs above the iPhone home indicator
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <MobileNavLinks />
    </nav>
  );
}
