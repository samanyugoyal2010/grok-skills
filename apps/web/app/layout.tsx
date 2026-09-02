import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skills — The Grok Agent Skills Directory",
  description:
    "Reusable capabilities for Grok Bot. Install via npx github:samanyugoyal2010/grok-skills (not npm).",
};

function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-border text-sm text-muted">
      <div className="flex gap-6">
        <Link href="/about" className="hover:text-accent">
          About
        </Link>
        <Link href="/docs/cli" className="hover:text-accent">
          CLI docs
        </Link>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-content px-6 py-10">
          <header className="mb-10">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              Skills
            </Link>
          </header>
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
