"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Brain, Lock, Eye, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    Icon: Brain,
    title: "Explainable Results",
    desc: "Every detection comes with transparent, human-readable explanations — not just a score. Understand exactly why content was flagged.",
  },
  {
    Icon: Zap,
    title: "Fast Analysis",
    desc: "Advanced models deliver detection results in under 2 seconds, so your workflow stays uninterrupted.",
  },
  {
    Icon: Shield,
    title: "Text & Voice",
    desc: "Detect AI-written text and synthetic voice audio in one unified platform — no switching between tools.",
  },
  {
    Icon: Lock,
    title: "Privacy First",
    desc: "Content you submit is processed in-session and never stored or shared. Your data stays yours.",
  },
  {
    Icon: Eye,
    title: "Deep Insights",
    desc: "Word-level highlighting, audio waveform analysis, and feature impact charts give you full visibility into the detection.",
  },
  {
    Icon: CheckCircle,
    title: "Enterprise Ready",
    desc: "API access, team management, and high-volume processing — built for organizations of any size.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
});

export function AboutSection() {
  return (
    <section id="about" style={{ padding: "96px 0 80px", borderTop: "1px solid var(--border)", background: "var(--bg-page)" }}>
      <div className="page-container">
        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 14 }}>About VeriGuard AI</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 14 }}>
            Built for the era of{" "}
            <span style={{ color: "var(--accent)" }}>AI-generated content</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
            VeriGuard AI helps individuals, businesses, and institutions verify the authenticity of text and voice content — with full, readable explanations at its core.
          </p>
        </motion.div>

        {/* Mission strip */}
        <motion.div
          {...fadeUp(0.07)}
          style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: 12, padding: "28px 36px", marginBottom: 60,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10, fontFamily: "var(--font-heading)" }}>Our Mission</div>
          <p style={{ fontSize: 16, color: "var(--text-primary)", lineHeight: 1.75, maxWidth: 680, marginBottom: 10 }}>
            "To make AI detection transparent, accessible, and actionable — giving people the tools to know what is real."
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 640 }}>
            As AI-generated content becomes harder to distinguish from human work, trust in digital content erodes. VeriGuard addresses this with detection models combined with explainability — so the verdict always comes with a clear reason.
          </p>
        </motion.div>

        {/* Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(0.05 + i * 0.05)} className="card" style={{ padding: "24px 22px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <f.Icon size={18} color="var(--accent)" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 7, fontFamily: "var(--font-heading)" }}>{f.title}</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
