"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Brain, Lock, Eye, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    Icon: Brain,
    title: "Explainable AI",
    desc: "Every detection result comes with transparent, human-readable explanations — not just a score. Understand exactly why content was flagged.",
  },
  {
    Icon: Zap,
    title: "Instant Results",
    desc: "Advanced deep learning models deliver detection verdicts in under 2 seconds, so your workflow never slows down.",
  },
  {
    Icon: Shield,
    title: "Dual Detection",
    desc: "Covers both AI-generated text (DeBERTa-v3) and synthetic voice (AASIST + WavLM-Large) in a single unified platform.",
  },
  {
    Icon: Lock,
    title: "Privacy First",
    desc: "Content you submit is processed in-session and never stored or shared. Your data stays yours.",
  },
  {
    Icon: Eye,
    title: "Deep Analysis",
    desc: "Token-level saliency heatmaps, attention rollout, SHAP values, and waveform analysis give you deep visibility into detection signals.",
  },
  {
    Icon: CheckCircle,
    title: "Enterprise Ready",
    desc: "Built for scale — API access, team management, and high-volume processing for organizations of any size.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
});

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "100px 0 80px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-page)",
      }}
    >
      <div className="page-container">
        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 16 }}>
            About VeriGuard AI
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 900, letterSpacing: "-0.03em",
            color: "var(--text-primary)", fontFamily: "var(--font-heading)",
            marginBottom: 16,
          }}>
            Built for the era of{" "}
            <span style={{ color: "var(--accent)" }}>AI-generated content</span>
          </h2>
          <p style={{
            fontSize: 16, color: "var(--text-secondary)", maxWidth: 580,
            margin: "0 auto", fontFamily: "var(--font-body)", lineHeight: 1.75,
          }}>
            VeriGuard AI is a research-backed detection platform that helps individuals, businesses, and institutions verify the authenticity of text and voice content — with full explainability at its core.
          </p>
        </motion.div>

        {/* Mission strip */}
        <motion.div
          {...fadeUp(0.08)}
          style={{
            background: "var(--accent-light)",
            border: "1px solid var(--border-accent)",
            borderRadius: 20,
            padding: "32px 40px",
            marginBottom: 64,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-heading)" }}>Our Mission</div>
          <p style={{ fontSize: 17, color: "var(--text-primary)", fontFamily: "var(--font-body)", lineHeight: 1.75, maxWidth: 720 }}>
            "To make AI detection transparent, accessible, and actionable — giving people the tools to know what is real."
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.7, maxWidth: 680 }}>
            As AI-generated content becomes indistinguishable from human-produced work, trust in digital content erodes. VeriGuard AI addresses this with state-of-the-art detection models combined with explainable AI techniques — so the verdict always comes with a reason.
          </p>
        </motion.div>

        {/* Features grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(0.06 + i * 0.06)}
              className="card"
              style={{ padding: "28px 24px" }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "var(--accent-light)", border: "1px solid var(--border-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <f.Icon size={20} color="var(--accent)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, fontFamily: "var(--font-heading)" }}>
                {f.title}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div {...fadeUp(0.3)} style={{ marginTop: 64, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16, fontFamily: "var(--font-heading)" }}>
            Powered by
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["DeBERTa-v3", "LlamaIndex ReAct", "AASIST", "WavLM-Large", "ESVAS", "SHAP", "Attention Rollout", "Integrated Gradients"].map(t => (
              <span key={t} className="mono" style={{
                fontSize: 11, padding: "5px 12px", borderRadius: 8,
                background: "var(--accent-light)", border: "1px solid var(--border)",
                color: "var(--accent)", letterSpacing: "0.02em",
              }}>{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
