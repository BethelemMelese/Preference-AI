import { MobileNav } from "@/components/layout/mobile-nav";
import { TopBar } from "@/components/layout/top-bar";

// Shared shell for every page in the (app) route group. The parentheses
// keep "(app)" out of the URL: (app)/page.tsx is still "/".
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <TopBar />
      {/* pb-28 on mobile leaves room above the fixed bottom bar */}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 md:px-6 md:pt-10 md:pb-16">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
