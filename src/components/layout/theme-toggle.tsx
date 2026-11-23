"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  function toggleTheme() {
    // classList.toggle returns the NEW state: true = "dark" was added.
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage blocked: the theme still switches, it just won't persist.
    }
  }

  // No useState: CSS decides which icon shows (dark:hidden / dark:block).
  // React never needs to know the theme, so the server HTML and the
  // browser always agree → no hydration mismatch, no icon flicker.
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
      <Sun className="dark:hidden" aria-hidden />
      <Moon className="hidden dark:block" aria-hidden />
    </Button>
  );
}
