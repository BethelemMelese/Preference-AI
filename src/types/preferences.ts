// =============================================================================
// PreferenceAI data model (TypeScript side).
//
// These types mirror the planned database models (docs/DATABASE.md). In
// Phase 3, Prisma generates matching types from the schema, and the API
// returns JSON in exactly these shapes.
//
// Dates are ISO-8601 strings ("2026-11-23T12:00:00.000Z"), not Date objects,
// because JSON has no Date type: what crosses the network is always a string.
// =============================================================================

/** The three recorded decisions. "Skip" is deliberately NOT here: skipping
 *  means "no decision", so nothing is stored. NOT_SURE is a real decision
 *  and must never be treated as DISLIKE. */
export type Decision = "LIKE" | "DISLIKE" | "NOT_SURE";

/** Where an item came from. Lets the UI and the AI tell user-created
 *  content apart from AI-generated content. */
export type ItemSource = "SEED" | "AI_GENERATED" | "USER_CREATED" | "AI_SUGGESTION";

/** The 10 predefined categories. A union of string literals means a typo
 *  like "fod-drinks" is a compile error, not a silent bug. */
export type CategorySlug =
  | "food-drinks"
  | "entertainment"
  | "hobbies"
  | "lifestyle"
  | "work-career"
  | "travel"
  | "technology"
  | "learning"
  | "social"
  | "creativity";

export type User = {
  id: string;
  /** Optional: guests have no name until they choose to give one. */
  name: string | null;
  email: string | null;
};

export type Category = {
  id: string;
  slug: CategorySlug;
  name: string;
  /** Short label shown as a chip, e.g. "Culinary & Taste". */
  tagline: string;
  description: string;
  sortOrder: number;
};

/** Something a user can rate. Shared across users. */
export type PreferenceItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  source: ItemSource;
};

/** THE SOURCE OF TRUTH: one user's decision about one item. AI output is
 *  never stored here. */
export type UserPreference = {
  id: string;
  itemId: string;
  decision: Decision;
  explanation: string | null;
  createdAt: string;
  updatedAt: string;
};

// -----------------------------------------------------------------------------
// AI output: always displayed WITH an "AI-generated" label, never mixed
// into the user's own decisions.
// -----------------------------------------------------------------------------

/** PENDING = not acted on yet ("ignore" = simply leave it pending).
 *  ACCEPTED = "Add to Discover": the idea becomes an UNRATED item in its
 *  category. Accepting is NOT a like; the user still rates it.
 *  REJECTED = "Not interested". Never recorded as a DISLIKE. */
export type SuggestionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type AISuggestion = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  /** The AI's explanation of why it suggested this. */
  reasoning: string;
  /** Which recorded decisions it was based on (so the UI can show them). */
  basedOnItemIds: string[];
  status: SuggestionStatus;
  createdAt: string;
};

export type ReportType = "ANALYSIS" | "REPORT";

/** Only the INTERPRETIVE parts of a report come from the AI. Likes,
 *  dislikes, uncertain items, and strongest categories are facts, so the
 *  app calculates them from UserPreference rows instead of trusting the
 *  model to restate them. */
export type AIReportContent = {
  overview: string;
  patterns: string[];
  connections: string[];
  recommendations: { title: string; reason: string }[];
  /** Ideas worth trying, often based on NOT_SURE items. */
  worthExploring: string[];
};

export type AIReport = {
  id: string;
  type: ReportType;
  /** How many decisions existed when it was generated: lets the UI say
   *  "5 new decisions since this report". */
  basedOnDecisions: number;
  content: AIReportContent;
  createdAt: string;
};

// -----------------------------------------------------------------------------
// Derived types: never stored, always CALCULATED from the data above.
// Storing them would create two sources of truth that can disagree.
// -----------------------------------------------------------------------------

export type CategoryStatus = "UNEXPLORED" | "IN_PROGRESS" | "COMPLETED";

export type CategoryProgress = {
  category: Category;
  totalItems: number;
  decidedCount: number;
  /** 0–100, rounded. */
  percent: number;
  status: CategoryStatus;
  firstActivityAt: string | null;
  lastActivityAt: string | null;
};

/** A decision joined with its item and category, ready to display. */
export type DecisionWithItem = {
  preference: UserPreference;
  item: PreferenceItem;
  category: Category;
};

/** Per-category decision counts, used for "strongest categories". */
export type CategoryDecisionSummary = {
  category: Category;
  likes: number;
  dislikes: number;
  notSure: number;
};
