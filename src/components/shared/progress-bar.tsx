import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary",
  complete: "bg-complete-accent",
  like: "bg-like-accent",
} as const;

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  /** Read by screen readers, e.g. "Food & Drinks progress". */
  label: string;
  tone?: keyof typeof TONES;
  className?: string;
};

/** A thin progress bar. role="progressbar" + aria-value* attributes let
 *  screen readers announce "Food & Drinks progress, 83%" instead of
 *  seeing two meaningless <div>s. */
export function ProgressBar({ value, label, tone = "primary", className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-progress-track", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", TONES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
