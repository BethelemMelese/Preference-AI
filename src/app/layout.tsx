import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// next/font downloads the fonts at BUILD time and serves them from our own
// domain: no request to Google from the user's browser, and no layout shift.
// `variable` exposes each font as a CSS variable that globals.css maps to
// Tailwind's font-sans / font-heading.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

// Runs in <head> while the browser parses the HTML, BEFORE the first paint,
// so dark-mode users never see a white flash. Order of preference:
// the choice saved by ThemeToggle → otherwise the OS setting.
// try/catch: localStorage can throw (private mode, blocked storage).
const themeScript = `(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();`;

export const metadata: Metadata = {
  title: "PreferenceAI",
  description:
    "Discover, organize, and understand your personal likes and dislikes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above may add "dark" to <html>
    // before React hydrates, so the server HTML and the browser DOM differ
    // ON PURPOSE. This silences the warning for this one element only.
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
