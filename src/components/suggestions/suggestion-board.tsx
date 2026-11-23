"use client";
// Client Component: accepting/rejecting changes what's shown immediately.
// Phase 2: status lives in React state. Phase 3+: PATCH /api/suggestions/:id.

import Link from "next/link";
import { useState } from "react";
import { Check, Lightbulb, Plus, Undo2, X } from "lucide-react";

import { CategoryIcon } from "@/components/shared/category-icon";
import { SourceBadge } from "@/components/shared/source-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategorySlug, Decision, SuggestionStatus } from "@/types/preferences";

/** Everything one card needs, prepared on the server (plain data only). */
export type SuggestionView = {
  id: string;
  title: string;
  description: string;
  reasoning: string;
  status: SuggestionStatus;
  category: { name: string; slug: CategorySlug };
  basedOn: { itemId: string; name: string; decision: Decision }[];
};

const TABS: { status: SuggestionStatus; label: string; empty: string }[] = [
  { status: "PENDING", label: "New", empty: "No new ideas right now." },
  { status: "ACCEPTED", label: "Added", empty: "Ideas you add to Discover appear here." },
  { status: "REJECTED", label: "Not interested", empty: "Ideas you turn down appear here." },
];

const BASED_ON_TONE: Record<Decision, string> = {
  LIKE: "border-like-border bg-like-surface text-like-foreground",
  DISLIKE: "border-dislike-border bg-dislike-surface text-dislike-foreground",
  NOT_SURE: "border-unsure-border bg-unsure-surface text-unsure-foreground",
};
const BASED_ON_VERB: Record<Decision, string> = { LIKE: "liked", DISLIKE: "disliked", NOT_SURE: "not sure" };

export function SuggestionBoard({ initialSuggestions }: { initialSuggestions: SuggestionView[] }) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [tab, setTab] = useState<SuggestionStatus>("PENDING");
  const [announcement, setAnnouncement] = useState("");

  function setStatus(id: string, status: SuggestionStatus) {
    setSuggestions((list) => list.map((s) => (s.id === id ? { ...s, status } : s)));
    const title = suggestions.find((s) => s.id === id)?.title;
    setAnnouncement(
      status === "ACCEPTED"
        ? `${title} added to Discover.`
        : status === "REJECTED"
          ? `${title} marked not interested.`
          : `${title} moved back to new ideas.`,
    );
    // Phase 3+: PATCH /api/suggestions/:id { status }
    // ACCEPTED also creates an unrated PreferenceItem (source AI_SUGGESTION).
  }

  const visible = suggestions.filter((s) => s.status === tab);
  const activeTab = TABS.find((t) => t.status === tab)!;

  return (
    <>
      <div role="group" aria-label="Filter ideas" className="-mx-4 mb-6 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="flex w-max gap-2">
          {TABS.map((t) => {
            const count = suggestions.filter((s) => s.status === t.status).length;
            const active = t.status === tab;
            return (
              <button
                key={t.status}
                type="button"
                onClick={() => setTab(t.status)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-body-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-label-sm",
                    active ? "bg-primary-foreground/20" : "bg-surface-container text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-body-md text-muted-foreground">
          {activeTab.empty}
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((s) => (
            <li key={s.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-tier-1">
                {/* Tinted header instead of photos: no image-generation cost */}
                <div className="flex items-center justify-between gap-3 bg-linear-to-br from-primary-soft to-surface-container-low px-5 py-4">
                  <span className="flex min-w-0 items-center gap-2 text-label-md">
                    <CategoryIcon slug={s.category.slug} className="size-9 bg-card" />
                    <span className="truncate">{s.category.name}</span>
                  </span>
                  <SourceBadge source="ai" />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-headline-sm">{s.title}</h2>
                  <p className="mt-1 text-body-md text-muted-foreground">{s.description}</p>

                  <p className="mt-4 flex gap-2 rounded-lg bg-surface-container-low p-3 text-body-md">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>
                      <span className="font-medium">Why: </span>
                      {s.reasoning}
                    </span>
                  </p>

                  <p className="mt-4 text-body-sm text-muted-foreground">Based on your answers</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {s.basedOn.map((b) => (
                      <li
                        key={b.itemId}
                        className={cn("rounded-full border px-2.5 py-0.5 text-label-sm", BASED_ON_TONE[b.decision])}
                      >
                        {b.name}
                        <span className="sr-only"> ({BASED_ON_VERB[b.decision]})</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    {s.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button onClick={() => setStatus(s.id, "ACCEPTED")} className="h-10 flex-1 rounded-full">
                          <Plus aria-hidden /> Add to Discover
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setStatus(s.id, "REJECTED")}
                          className="h-10 rounded-full px-4 text-muted-foreground"
                        >
                          <X aria-hidden /> Not interested
                        </Button>
                      </div>
                    )}
                    {s.status === "ACCEPTED" && (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-label-md text-like-foreground">
                          <Check className="size-4" aria-hidden /> Added to {s.category.name}
                        </span>
                        <div className="flex gap-1">
                          <Button asChild variant="outline" className="h-9 rounded-full px-4">
                            <Link href={`/discover/${s.category.slug}`}>Rate it</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setStatus(s.id, "PENDING")}
                            aria-label={`Undo adding ${s.title}`}
                          >
                            <Undo2 aria-hidden />
                          </Button>
                        </div>
                      </div>
                    )}
                    {s.status === "REJECTED" && (
                      <Button
                        variant="ghost"
                        onClick={() => setStatus(s.id, "PENDING")}
                        className="h-9 rounded-full px-3 text-muted-foreground"
                      >
                        <Undo2 aria-hidden /> Undo
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}
