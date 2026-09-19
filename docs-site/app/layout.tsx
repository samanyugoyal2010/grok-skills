import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Task-Time Skill Compiler — Documentation",
  description: "Compile public agent guidance into a repo-aware SKILL.md for Claude Code.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: "Task-Time Skill Compiler — Documentation",
    description: "Compile public agent guidance into a repo-aware SKILL.md for Claude Code.",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Task-Time Skill Compiler — Documentation",
    description: "Compile public agent guidance into a repo-aware SKILL.md for Claude Code."
  },
  icons: { icon: "/favicon.svg" }
};

export const viewport: Viewport = {
  themeColor: "#10161b"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
