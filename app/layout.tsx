import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habib Mehmoodi | AI Strategy & Go-to-Market",
  description:
    "Turn complex AI innovation into revenue-generating outcomes. AI Platform Strategy, Go-to-Market, and Market Expansion expertise.",
  keywords: [
    "AI Strategy",
    "Go-to-Market",
    "Enterprise AI",
    "AI Governance",
    "Market Expansion",
    "B2B Technology",
  ],
  authors: [{ name: "Habib Mehmoodi" }],
  openGraph: {
    title: "Habib Mehmoodi | AI Strategy & Go-to-Market",
    description:
      "Turn complex AI innovation into revenue-generating outcomes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {children}
      </body>
    </html>
  );
}
