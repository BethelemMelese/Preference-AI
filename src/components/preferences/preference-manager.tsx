"use client";
// Module 8: view, filter, edit, delete. Phase 2: changes live in React
// state. Phase 3: each handler also calls the API (marked below).

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  CircleExclamationPoint,
  CircleQuestionMark,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash,
  X,
  type LucideIcon,
} from "lucide-react";

import { CategoryIcon } from "@/components/shared/category-icon";
import { Panel } from "@/components/shared/panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategorySlug, Decision } from "@/types/preferences";

/** One row, prepared on the server (dateLabel is pre-formatted there so the
 *  server and browser render identical text: no hydration mismatch). */
export type PreferenceRow = {
  id: string;
  itemName: string;
  categoryId: string;
  categoryName: string;
  categorySlug: CategorySlug;
  decision: Decision;
  explanation: string | null;
  dateLabel: string;
};

type Filter = "ALL" | Decision;

const DECISIONS: { decision: Decision; label: string; icon: LucideIcon; selected: string }[] = [
  { decision: "LIKE", label: "Liked", icon: ThumbsUp, selected: "border-like-border bg-like-surface text-like-foreground" },
  { decision: "DISLIKE", label: "Disliked", icon: ThumbsDown, selected: "border-dislike-border bg-dislike-surface text-dislike-foreground" },
  { decision: "NOT_SURE", label: "Not sure", icon: CircleQuestionMark, selected: "border-unsure-border bg-unsure-surface text-unsure-foreground" },
];

const NOTE_MAX = 280;

type Props = {
  initialRows: PreferenceRow[];
  categories: { id: string; name: string }[];
};

export function PreferenceManager({ initialRows, categories }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [decisionFilter, setDecisionFilter] = useState<Filter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const visible = rows.filter(
    (r) =>
      (decisionFilter === "ALL" || r.decision === decisionFilter) &&
      (categoryFilter === "ALL" || r.categoryId === categoryFilter),
  );

  function changeDecision(row: PreferenceRow, decision: Decision) {
    setRows(rows.map((r) => (r.id === row.id ? { ...r, decision } : r)));
    setAnnouncement(`${row.itemName} changed to ${DECISIONS.find((d) => d.decision === decision)?.label}.`);
    // Phase 3: PATCH /api/preferences/:id { decision }
  }

  function startEditing(row: PreferenceRow) {
    setEditingId(row.id);
    setNoteDraft(row.explanation ?? "");
    setConfirmingId(null);
  }

  function saveNote(row: PreferenceRow) {
    setRows(rows.map((r) => (r.id === row.id ? { ...r, explanation: noteDraft.trim() || null } : r)));
    setEditingId(null);
    setAnnouncement(`Note saved for ${row.itemName}.`);
    // Phase 3: PATCH /api/preferences/:id { explanation }
  }

  function deleteRow(row: PreferenceRow) {
    setRows(rows.filter((r) => r.id !== row.id));
    setConfirmingId(null);
    setAnnouncement(`Deleted your answer for ${row.itemName}.`);
    // Phase 3: DELETE /api/preferences/:id
  }

  function deleteAll() {
    setRows([]);
    setConfirmingAll(false);
    setAnnouncement("All your data was deleted.");
    // Phase 3: DELETE /api/me (removes the user; the database cascades to
    // preferences, suggestions, and reports)
  }

  const filterButtons: { value: Filter; label: string; count: number }[] = [
    { value: "ALL", label: "All", count: rows.length },
    ...DECISIONS.map((d) => ({
      value: d.decision,
      label: d.label,
      count: rows.filter((r) => r.decision === d.decision).length,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by answer" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex w-max gap-2">
            {filterButtons.map((f) => {
              const active = decisionFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setDecisionFilter(f.value)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-body-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent",
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-label-sm",
                      active ? "bg-primary-foreground/20" : "bg-surface-container text-muted-foreground",
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-body-md">
          <span className="text-muted-foreground">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-full border border-input bg-card px-4 text-body-md outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
          >
            <option value="ALL">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      <Panel aria-label="Your answers" className="p-0 md:p-0">
        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-body-md text-muted-foreground">
              {rows.length === 0 ? "You have no saved answers." : "No answers match these filters."}
            </p>
            {rows.length === 0 && (
              <Button asChild className="mt-4 h-10 rounded-full px-5">
                <Link href="/discover">Start discovering</Link>
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {visible.map((row) => (
              <li key={row.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:px-6">
                <div className="flex min-w-0 flex-1 gap-3">
                  <CategoryIcon slug={row.categorySlug} shape="square" className="size-10" />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-md font-medium">{row.itemName}</p>
                    <p className="text-body-sm text-muted-foreground">
                      {row.categoryName} · {row.dateLabel}
                    </p>

                    {editingId === row.id ? (
                      <div className="mt-2">
                        <label htmlFor={`note-${row.id}`} className="sr-only">
                          Note for {row.itemName}
                        </label>
                        <textarea
                          id={`note-${row.id}`}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          maxLength={NOTE_MAX}
                          rows={2}
                          autoFocus
                          className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-body-md outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                        />
                        <div className="mt-2 flex gap-2">
                          <Button onClick={() => saveNote(row)} className="h-8 rounded-full px-4">
                            Save note
                          </Button>
                          <Button variant="ghost" onClick={() => setEditingId(null)} className="h-8 rounded-full px-3">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      row.explanation && (
                        <p className="mt-1.5 border-l-2 border-primary/40 pl-2.5 text-body-md text-muted-foreground">
                          {row.explanation}
                        </p>
                      )
                    )}
                  </div>
                </div>

                {confirmingId === row.id ? (
                  <div className="flex items-center gap-2 md:pt-1" role="group" aria-label={`Confirm deleting ${row.itemName}`}>
                    <span className="text-body-md">Delete this answer?</span>
                    <Button variant="destructive" onClick={() => deleteRow(row)} className="h-8 rounded-full px-3">
                      Delete
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmingId(null)} className="h-8 rounded-full px-3">
                      Keep
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 md:pt-1">
                    {/* Change the answer in place: three small toggle buttons */}
                    <div role="group" aria-label={`Answer for ${row.itemName}`} className="flex gap-1">
                      {DECISIONS.map(({ decision, label, icon: Icon, selected }) => {
                        const isSelected = row.decision === decision;
                        return (
                          <button
                            key={decision}
                            type="button"
                            onClick={() => changeDecision(row, decision)}
                            aria-pressed={isSelected}
                            title={label}
                            className={cn(
                              "grid size-9 place-items-center rounded-full border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                              isSelected ? selected : "border-transparent text-muted-foreground hover:bg-accent",
                            )}
                          >
                            <Icon className="size-4" aria-hidden />
                            <span className="sr-only">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="mx-1 h-6 w-px bg-border" aria-hidden />
                    <Button variant="ghost" size="icon" onClick={() => startEditing(row)} aria-label={`Edit note for ${row.itemName}`}>
                      <Pencil aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setConfirmingId(row.id);
                        setEditingId(null);
                      }}
                      aria-label={`Delete answer for ${row.itemName}`}
                      className="hover:text-destructive"
                    >
                      <Trash aria-hidden />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* ── Related history (Module 8) ───────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/suggestions" className="rounded-xl border border-border/60 bg-card p-5 shadow-tier-1 transition-shadow hover:shadow-tier-2">
          <p className="text-headline-sm">AI suggestions you reviewed</p>
          <p className="mt-1 text-body-md text-muted-foreground">See ideas you added or turned down.</p>
        </Link>
        <Link href="/insights" className="rounded-xl border border-border/60 bg-card p-5 shadow-tier-1 transition-shadow hover:shadow-tier-2">
          <p className="text-headline-sm">Past reports</p>
          <p className="mt-1 text-body-md text-muted-foreground">Read earlier AI reports or generate a new one.</p>
        </Link>
      </div>

      {/* ── Your data (privacy) ──────────────────────────────── */}
      <Panel aria-labelledby="data-heading" className="border-dislike-border">
        <h2 id="data-heading" className="flex items-center gap-2 text-headline-sm">
          <CircleExclamationPoint className="size-5 text-dislike-foreground" aria-hidden />
          Delete all my data
        </h2>
        <p className="mt-1 text-body-md text-muted-foreground">
          Permanently removes all your answers, notes, AI suggestions, and reports. This cannot be undone.
        </p>
        {confirmingAll ? (
          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Confirm deleting all data">
            <span className="text-body-md font-medium">Are you sure?</span>
            <Button variant="destructive" onClick={deleteAll} className="h-10 rounded-full px-4">
              <Check aria-hidden /> Yes, delete everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirmingAll(false)} className="h-10 rounded-full px-4">
              <X aria-hidden /> Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="destructive"
            onClick={() => setConfirmingAll(true)}
            disabled={rows.length === 0}
            className="mt-4 h-10 rounded-full px-4"
          >
            Delete all my data
          </Button>
        )}
      </Panel>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
