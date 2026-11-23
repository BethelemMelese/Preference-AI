"use client";
// The core interaction of the app (Module 3). A Client Component because it
// holds state that changes on every click: the answers and the current item.
//
// Phase 2: answers live in React state (reset on reload).
// Phase 3: decide()/clear()/updateNote() also call the API (marked below);
// the UI updates instantly and the request saves in the background
// ("optimistic UI").

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  PartyPopper,
  Plus,
  SkipForward,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

import { CategoryIcon } from "@/components/shared/category-icon";
import { DecisionChip } from "@/components/shared/decision-chip";
import { Panel } from "@/components/shared/panel";
import { ProgressBar } from "@/components/shared/progress-bar";
import { SoonButton } from "@/components/shared/soon-button";
import { SourceBadge } from "@/components/shared/source-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category, Decision, PreferenceItem } from "@/types/preferences";

export type RecordedAnswer = { decision: Decision; explanation: string | null };
type Answers = Record<string, RecordedAnswer>;

type DiscoveryDeckProps = {
  category: Category;
  items: PreferenceItem[];
  /** Answers already saved for this category, keyed by item id. */
  initialAnswers: Answers;
};

const NOTE_MAX = 280;

const OPTIONS: { decision: Decision; label: string; icon: LucideIcon; idle: string; selected: string }[] = [
  {
    decision: "LIKE",
    label: "Like",
    icon: ThumbsUp,
    idle: "hover:border-like-border hover:bg-like-surface hover:text-like-foreground",
    selected: "border-like-border bg-like-surface text-like-foreground ring-2 ring-like-accent/40",
  },
  {
    decision: "DISLIKE",
    label: "Dislike",
    icon: ThumbsDown,
    idle: "hover:border-dislike-border hover:bg-dislike-surface hover:text-dislike-foreground",
    selected: "border-dislike-border bg-dislike-surface text-dislike-foreground ring-2 ring-dislike-accent/40",
  },
  {
    decision: "NOT_SURE",
    label: "Not sure",
    icon: CircleQuestionMark,
    idle: "hover:border-unsure-border hover:bg-unsure-surface hover:text-unsure-foreground",
    selected: "border-unsure-border bg-unsure-surface text-unsure-foreground ring-2 ring-unsure-accent/40",
  },
];

const PAST_TENSE: Record<Decision, string> = {
  LIKE: "Liked",
  DISLIKE: "Disliked",
  NOT_SURE: "Marked not sure:",
};

/** Index of the next item without an answer, searching forward from
 *  `from` and wrapping around. -1 when every item is answered. */
function findNextUnanswered(items: PreferenceItem[], answers: Answers, from: number): number {
  for (let step = 1; step <= items.length; step++) {
    const i = (from + step) % items.length;
    if (!answers[items[i].id]) return i;
  }
  return -1;
}

export function DiscoveryDeck({ category, items, initialAnswers }: DiscoveryDeckProps) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  // Lazy initial state (a function): runs once, on the first render only.
  const [index, setIndex] = useState(() => Math.max(0, items.findIndex((item) => !initialAnswers[item.id])));
  const [note, setNote] = useState(() => initialAnswers[items[index]?.id]?.explanation ?? "");
  // Read aloud by screen readers after each action (aria-live region).
  const [announcement, setAnnouncement] = useState("");

  if (items.length === 0) {
    return (
      <Panel className="text-center">
        <p className="text-body-lg">No items in this category yet.</p>
        <SoonButton className="mt-4" variant="default">
          <Plus aria-hidden /> Generate items with AI
        </SoonButton>
      </Panel>
    );
  }

  const current = items[index];
  const answer = answers[current.id];
  const answeredCount = items.filter((item) => answers[item.id]).length;
  const allDone = answeredCount === items.length;
  const percent = Math.round((answeredCount / items.length) * 100);
  const counts = { LIKE: 0, DISLIKE: 0, NOT_SURE: 0 };
  for (const item of items) {
    const a = answers[item.id];
    if (a) counts[a.decision]++;
  }

  /** Move to an item and load ITS note into the text box. Doing both in one
   *  event handler (not in a useEffect) keeps them in sync in one render. */
  function goTo(nextIndex: number, currentAnswers: Answers = answers) {
    setIndex(nextIndex);
    setNote(currentAnswers[items[nextIndex].id]?.explanation ?? "");
  }

  function decide(decision: Decision) {
    const wasAnswered = Boolean(answer);
    const next: Answers = { ...answers, [current.id]: { decision, explanation: note.trim() || null } };
    setAnswers(next);
    // Phase 3: POST /api/preferences { itemId: current.id, decision, explanation }

    if (wasAnswered) {
      // Changing an earlier answer: stay on this item, don't jump away.
      setAnnouncement(`Changed ${current.name} to ${OPTIONS.find((o) => o.decision === decision)?.label}.`);
      return;
    }
    const nextIndex = findNextUnanswered(items, next, index);
    if (nextIndex === -1) {
      setAnnouncement(`${PAST_TENSE[decision]} ${current.name}. You rated every item in ${category.name}.`);
    } else {
      setAnnouncement(`${PAST_TENSE[decision]} ${current.name}. Next: ${items[nextIndex].name}.`);
      goTo(nextIndex, next);
    }
  }

  /** Skip = no decision. Nothing is recorded. */
  function skip() {
    const nextUnanswered = findNextUnanswered(items, answers, index);
    const nextIndex = nextUnanswered === -1 || nextUnanswered === index ? (index + 1) % items.length : nextUnanswered;
    setAnnouncement(`Skipped ${current.name}.`);
    goTo(nextIndex);
  }

  function clearAnswer() {
    const next = { ...answers };
    delete next[current.id];
    setAnswers(next);
    // Phase 3: DELETE /api/preferences/:id
    setAnnouncement(`Removed your answer for ${current.name}.`);
  }

  function updateNote(value: string) {
    setNote(value);
    // If the item is already answered, the note edits that saved answer.
    if (answer) {
      setAnswers({ ...answers, [current.id]: { ...answer, explanation: value.trim() || null } });
      // Phase 3: PATCH /api/preferences/:id (debounced)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 rounded-md text-body-md text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All categories
      </Link>

      <header className="flex items-center gap-4">
        <CategoryIcon slug={category.slug} className="size-12" />
        <div className="min-w-0">
          <h1 className="text-headline-lg-mobile md:text-headline-lg">{category.name}</h1>
          <p className="text-body-md text-muted-foreground">{category.description}</p>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* ── Main: the current item ───────────────────────────── */}
        <div className="space-y-4">
          {allDone && (
            <Panel className="border-like-border">
              <div className="flex gap-3">
                <PartyPopper className="size-6 shrink-0 text-like-foreground" aria-hidden />
                <div>
                  <h2 className="text-headline-sm">You rated every item in {category.name}</h2>
                  <p className="mt-1 text-body-md text-muted-foreground">
                    {counts.LIKE} liked · {counts.DISLIKE} disliked · {counts.NOT_SURE} not sure. You can
                    still change any answer below.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild className="h-10 rounded-full px-4">
                      <Link href="/discover">Explore another category</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-10 rounded-full px-4">
                      <Link href="/suggestions">See ideas for you</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          <Panel aria-labelledby="item-name">
            <div className="flex items-center justify-between gap-3">
              <span className="text-label-md text-muted-foreground">
                Item {index + 1} of {items.length}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label="Previous item"
                >
                  <ChevronLeft aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goTo(index + 1)}
                  disabled={index === items.length - 1}
                  aria-label="Next item"
                >
                  <ChevronRight aria-hidden />
                </Button>
              </div>
            </div>

            {/* Compact progress on mobile; the sidebar shows it on desktop */}
            <ProgressBar className="mt-3 lg:hidden" value={percent} label={`${category.name} progress`} />

            <div className="flex flex-col items-center py-10 text-center md:py-14">
              {(current.source === "AI_GENERATED" || current.source === "AI_SUGGESTION") && (
                <SourceBadge source="ai" className="mb-3" />
              )}
              <h2 id="item-name" className="text-headline-md md:text-headline-lg">
                {current.name}
              </h2>
              <p className="mt-2 max-w-md text-body-lg text-muted-foreground">{current.description}</p>
              {answer && (
                <p className="mt-4 flex items-center gap-2 text-body-md text-muted-foreground">
                  Your answer: <DecisionChip decision={answer.decision} />
                </p>
              )}
            </div>

            <div role="group" aria-label="Your answer" className="grid grid-cols-3 gap-2 sm:gap-3">
              {OPTIONS.map(({ decision, label, icon: Icon, idle, selected }) => {
                const isSelected = answer?.decision === decision;
                return (
                  <button
                    key={decision}
                    type="button"
                    onClick={() => decide(decision)}
                    // aria-pressed: screen readers announce "Like, toggle button, pressed"
                    aria-pressed={isSelected}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border bg-card px-2 py-4 text-label-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      isSelected ? selected : cn("border-border text-foreground", idle),
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex min-h-10 items-center justify-center">
              {answer ? (
                <Button variant="ghost" onClick={clearAnswer} className="text-muted-foreground">
                  Remove my answer
                </Button>
              ) : (
                <Button variant="ghost" onClick={skip} className="text-muted-foreground">
                  <SkipForward aria-hidden /> Skip for now
                </Button>
              )}
            </div>

            <div className="mt-4 border-t border-border/60 pt-5">
              <label htmlFor="note" className="text-label-md">
                Why? <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(event) => updateNote(event.target.value)}
                maxLength={NOTE_MAX}
                rows={2}
                placeholder="A few words help the AI understand you better"
                className="mt-2 w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-body-md outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
              />
              <p className="mt-1 text-right text-body-sm text-muted-foreground">
                {note.length}/{NOTE_MAX}
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Side: progress + all items ───────────────────────── */}
        <Panel aria-labelledby="progress-heading">
          <div className="flex items-baseline justify-between">
            <h2 id="progress-heading" className="text-headline-sm">
              Progress
            </h2>
            <span className="font-heading text-headline-sm text-primary">{percent}%</span>
          </div>
          <ProgressBar
            className="mt-3"
            value={percent}
            label={`${category.name} progress`}
            tone={allDone ? "complete" : "primary"}
          />
          <p className="mt-2 text-body-sm text-muted-foreground">
            {answeredCount} rated · {items.length - answeredCount} remaining
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {OPTIONS.map(({ decision, label }) => (
              // HTML requires <dt> before <dd>; flex-col-reverse shows the number on top.
              <div key={decision} className="flex flex-col-reverse rounded-lg bg-surface-container-low px-1 py-2">
                <dt className="text-body-sm text-muted-foreground">{label}</dt>
                <dd className="font-heading text-headline-sm">{counts[decision]}</dd>
              </div>
            ))}
          </dl>

          <ol className="mt-4 space-y-1 border-t border-border/60 pt-4">
            {items.map((item, i) => {
              const itemAnswer = answers[item.id];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === index ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-body-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      i === index ? "bg-primary-soft" : "hover:bg-accent",
                    )}
                  >
                    <span className="w-5 shrink-0 text-body-sm text-muted-foreground">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{item.name}</span>
                    {itemAnswer ? (
                      <DecisionChip decision={itemAnswer.decision} className="px-2 text-label-sm" />
                    ) : (
                      <span className="text-body-sm text-muted-foreground">Remaining</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <SoonButton className="mt-4 w-full">
            <Plus aria-hidden /> Generate more items
          </SoonButton>
        </Panel>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
