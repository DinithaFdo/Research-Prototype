import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriGuard AI – AI Content Detection",
  description: "Detect AI-generated text and synthetic voice with clear, human-readable explanations. Fast, reliable, and built for real-world verification.",
  keywords: ["AI detection", "AI text detection", "synthetic voice detection", "deepfake audio", "explainable AI"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
