import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Josh Dog Kush — Change Request Portal",
  description:
    "Submit change requests for the Josh Dog Kush website, with an AI assistant to help write descriptions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
