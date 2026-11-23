import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  /** Rendered width/height of the mark in pixels. */
  size?: number;
  /** Show the "PreferenceAI" wordmark next to the mark. */
  showWordmark?: boolean;
  className?: string;
};

export function Logo({ size = 32, showWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/* next/image resizes and serves modern formats (WebP/AVIF) on demand.
          With a visible wordmark, the image is decorative (alt=""), so screen
          readers don't announce the name twice. */}
      <Image
        src="/logo.png"
        alt={showWordmark ? "" : "PreferenceAI"}
        width={size}
        height={size}
        priority
      />
      {showWordmark && (
        <span className="font-heading text-headline-sm text-foreground">
          PreferenceAI
        </span>
      )}
    </span>
  );
}
