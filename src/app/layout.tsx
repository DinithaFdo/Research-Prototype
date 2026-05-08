import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriGuard AI – AI Detection Platform",
  description: "Enterprise-grade AI detection platform for text authenticity and synthetic voice analysis. Fast, explainable results powered by DeBERTa-v3, AASIST, WavLM, and deep learning.",
  keywords: ["AI detection", "AI text detection", "deepfake voice detection", "synthetic voice analysis", "explainable AI"],
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
