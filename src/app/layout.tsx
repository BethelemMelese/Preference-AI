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

export const metadata: Metadata = {
  title: "PreferenceAI",
  description:
    "Discover, organize, and understand your personal likes and dislikes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
