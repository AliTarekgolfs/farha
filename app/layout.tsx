import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farha — فرحة",
  description: "Create and share beautiful event invitations. RSVP in seconds.",
  openGraph: {
    title: "Farha — فرحة",
    description: "Create and share beautiful event invitations.",
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
      <body>{children}</body>
    </html>
  );
}
