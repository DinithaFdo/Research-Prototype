"use client";
import { motion } from "framer-motion";
import { Brain, Mic, ArrowRight, Zap } from "lucide-react";

const STATS = [
  { value: "96.3%", label: "Text Detection Accuracy",  sub: "DeBERTa-v3 ensemble" },
  { value: "90.2%", label: "Voice Detection Confidence", sub: "4-branch adaptive fusion" },
  { value: "84.7",  label: "Explanation Faithfulness",   sub: "AOPC quality metric" },
  { value: "<1.2s", label: "Processing Latency",         sub: "Per document inference" },
];

const TECH_TAGS = [
  "DeBERTa-v3", "LlamaIndex ReAct", "AASIST",
  "WavLM-Large", "ESVAS", "SHAP", "Attention Rollout",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as unknown as import("framer-motion").Variants;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.55 } },
} as unknown as import("framer-motion").Variants;

export function HeroSection({ onTextStart, onVoiceStart }: { onTextStart: () => void; onVoiceStart: () => void }) {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 88px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 0 72px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <motion.div
        variants={container} initial="hidden" animate="show"
        style={{ width: "100%", maxWidth: 820, margin: "0 auto" }}
      >
        {/* Status badge */}
        <motion.div variants={fadeUp} style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <span className="badge badge-indigo" style={{ fontSize: 11, padding: "6px 16px", gap: 8 }}>
            <span className="pulse-dot" style={{ background: "var(--accent)", color: "var(--accent)" }} />
            AI Detection Platform · Powered by Explainable Deep Learning
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(40px, 6.5vw, 68px)",
            fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05,
            marginBottom: 20, color: "var(--text-primary)", fontFamily: "var(--font-heading)",
          }}
        >
          Detect AI-generated text and
          <br />
          <span className="gradient-text-violet">synthetic voice content</span>
          {" "}instantly
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 18, fontWeight: 500, color: "var(--text-secondary)",
            maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.75,
            fontFamily: "var(--font-body)",
          }}
        >
          Upload or paste content to receive fast, explainable detection insights.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}
        >
          <button id="hero-text-detection-btn" className="btn-primary" onClick={onTextStart}
            style={{ fontSize: 15, padding: "14px 28px", gap: 10 }}
          >
            <Brain size={16} />
            Start Text Detection
            <ArrowRight size={15} />
          </button>
          <button id="hero-voice-detection-btn" className="btn-secondary" onClick={onVoiceStart}
            style={{ fontSize: 15, padding: "14px 28px" }}
          >
            <Mic size={16} />
            Try Voice Analysis
          </button>
          <button id="hero-demo-btn" className="btn-ghost" onClick={() => {}}
            style={{ fontSize: 14, padding: "14px 24px" }}
          >
            <Zap size={14} />
            Live Demo
          </button>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={container}
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}
        >
          {STATS.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="card"
              style={{ padding: "24px 16px", textAlign: "center", cursor: "default" }}
            >
              <div className="mono gradient-text-violet" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4, fontFamily: "var(--font-heading)" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech tags */}
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {TECH_TAGS.map(t => (
            <span key={t} className="mono" style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 6,
              background: "var(--accent-light)", border: "1px solid var(--border)",
              color: "var(--accent)", letterSpacing: "0.03em",
            }}>{t}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
