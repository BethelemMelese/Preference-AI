import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

// Page-level metadata overrides the root layout's <title> for this route only.
export const metadata: Metadata = {
  title: "About · PreferenceAI",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      {/* Same pattern as the home page: Button styles, Link navigates. */}
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link href="/">
          <ArrowLeft /> Back to home
        </Link>
      </Button>

      <Logo />

      <h1 className="text-headline-lg-mobile md:text-headline-lg">
        About PreferenceAI
      </h1>

      <p className="text-muted-foreground">
        PreferenceAI helps you discover and understand what you like. Explore
        categories, mark items as Like, Dislike, or Not sure, and receive
        AI-generated suggestions and reports.
      </p>

      <p className="text-muted-foreground">
        Your own choices are always the source of truth. Anything the AI
        produces (suggestions, patterns, interpretations) is clearly labelled
        and kept separate, and it never changes a preference you recorded.
      </p>
    </main>
  );
}
