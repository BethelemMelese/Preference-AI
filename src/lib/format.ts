// Intl.RelativeTimeFormat is built into JavaScript, so no date library needed.
// numeric: "auto" gives natural words: "yesterday" instead of "1 day ago".
const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** "today", "yesterday", "3 days ago", "2 weeks ago"… */
export function formatRelativeDay(iso: string, now: Date): string {
  const days = Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY_MS);
  if (days < 14) return relativeTime.format(-days, "day");
  return relativeTime.format(-Math.round(days / 7), "week");
}
