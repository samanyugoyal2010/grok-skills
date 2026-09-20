import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const socialImages = siteUrl ? [{ url: "/og.svg", width: 1_200, height: 630, alt: "Task-Time Skill Compiler documentation" }] : undefined;

export const metadata: Metadata = {
  title: "Task-Time Skill Compiler — Documentation",
  description: "Compile public agent guidance into a repo-aware SKILL.md for Claude Code.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: "Task-Time Skill Compiler — Documentation",
    description: "Compile public agent guidance into a repo-aware SKILL.md for Claude Code.",
    type: "website",
    ...(socialImages ? { images: socialImages } : {})
  },
  twitter: {
    card: "summary_large_image",
    title: "Task-Time Skill Compiler — Documentation",
    description: "Compile public agent guidance into a repo-aware SKILL.md for Claude Code.",
    ...(siteUrl ? { images: ["/og.svg"] } : {})
  },
  icons: { icon: "/favicon.svg" }
};

export const viewport: Viewport = {
  themeColor: "#eef0ec"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
