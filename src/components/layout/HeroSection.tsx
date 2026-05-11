"use client";
import { motion } from "framer-motion";
import { FileText, Mic, Eye, Zap, ArrowRight } from "lucide-react";

const FEATURES = [
  { Icon: FileText, label: "Text Detection",      desc: "Check if text was written by AI" },
  { Icon: Mic,      label: "Voice Detection",     desc: "Check if a voice is synthetic" },
  { Icon: Eye,      label: "Clear Explanations",  desc: "Every result comes with a reason" },
  { Icon: Zap,      label: "Fast Results",        desc: "Analysis done in under 2 seconds" },
];

const STATS = [
  { value: "2-in-1",    label: "Detection Modes" },
  { value: "< 2s",      label: "Time to Result" },
  { value: "Explained", label: "Every Result" },
  { value: "Free",      label: "No Sign-up Needed" },
];

export function HeroSection({
  onTextStart,
  onVoiceStart,
  onDemoStart,
}: {
  onTextStart: () => void;
  onVoiceStart: () => void;
  onDemoStart?: () => void;
}) {
  return (
    <>
      {/* ── Dark hero ───────────────────────────────────────────────── */}
      <section style={{ background: "#09090B", padding: "108px 0 84px", position: "relative", overflow: "hidden" }}>
        {/* Dot grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(124,58,237,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "50%", height: "1px", background: "linear-gradient(to right, transparent, rgba(124,58,237,0.5), transparent)" }} />

        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            style={{ textAlign: "center", maxWidth: 740, margin: "0 auto" }}
          >
            {/* Label chip */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)", marginBottom: 28 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7C3AED" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#A78BFA", letterSpacing: "0.02em" }}>AI Content Detection Platform</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.08,
              color: "#FAFAFA", fontFamily: "var(--font-heading)",
              marginBottom: 20,
            }}>
              Detect AI-written text and{" "}
              <span style={{ color: "#7C3AED" }}>synthetic voice</span>{" "}
              with confidence.
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: 17, color: "#A1A1AA", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
              Upload text or audio and get a clear result with simple explanations.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
              <button
                onClick={onTextStart}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 8, fontSize: 15, fontWeight: 600,
                  background: "#7C3AED", color: "#fff", border: "none", cursor: "pointer",
                  transition: "background 0.15s", fontFamily: "var(--font-body)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#6D28D9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#7C3AED"; }}
              >
                Start Analysis <ArrowRight size={15} />
              </button>
              <button
                onClick={onDemoStart}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 24px", borderRadius: 8, fontSize: 15, fontWeight: 600,
                  background: "transparent", color: "#FAFAFA",
                  border: "1.5px solid rgba(255,255,255,0.18)", cursor: "pointer",
                  transition: "all 0.15s", fontFamily: "var(--font-body)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.36)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                View Demo
              </button>
            </div>

            {/* Stats strip */}
            <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32 }}>
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                  style={{ textAlign: "center" }}
                >
                  <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: "#FAFAFA", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#71717A", marginTop: 5 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature strip ───────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-page)", borderBottom: "1px solid var(--border)", padding: "44px 0" }}>
        <div className="page-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.Icon size={18} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
