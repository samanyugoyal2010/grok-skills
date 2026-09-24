import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const socialImages = siteUrl ? [{ url: "/og.svg", width: 1_200, height: 630, alt: "SkillChef agent skill workbench" }] : undefined;

export const metadata: Metadata = {
  title: "SkillChef — Make your repo’s way of working a skill",
  description: "Prepare repeatable developer workflows as reviewable, repo-aware Agent Skills.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: "SkillChef — The agent skill workbench",
    description: "Prepare repeatable developer workflows as reviewable, repo-aware Agent Skills.",
    type: "website",
    ...(socialImages ? { images: socialImages } : {})
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillChef — The agent skill workbench",
    description: "Prepare repeatable developer workflows as reviewable, repo-aware Agent Skills.",
    ...(siteUrl ? { images: ["/og.svg"] } : {})
  },
  icons: { icon: "/favicon.svg" }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8ece7" },
    { media: "(prefers-color-scheme: dark)", color: "#090b0d" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
