"use client";
import { motion } from "framer-motion";
import { Upload, Play, FileCheck, FileText, Mic, ArrowRight } from "lucide-react";

/* ── How It Works ───────────────────────────────────────────────────────── */
const HOW_STEPS = [
  { n: "01", Icon: Upload,    title: "Upload content",  desc: "Paste text or upload an audio file. Supports .txt, .wav, and .mp3 formats." },
  { n: "02", Icon: Play,      title: "Run analysis",    desc: "Click Analyze and let VeriGuard check the content against AI detection patterns." },
  { n: "03", Icon: FileCheck, title: "Review result",   desc: "Get a clear verdict with a confidence score and a plain-language explanation." },
];

export function HowItWorksSection() {
  return (
    <section style={{ padding: "80px 0", background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 12 }}>
            Three steps to a clear result
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            No setup required. Upload your content and get an answer in seconds.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {HOW_STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
              className="card" style={{ padding: "28px 24px" }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 14, fontFamily: "var(--font-mono)" }}>{s.n}</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <s.Icon size={18} color="var(--accent)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Detection Showcase ─────────────────────────────────────────────────── */
export function DetectionShowcaseSection({
  onTextStart,
  onVoiceStart,
}: {
  onTextStart: () => void;
  onVoiceStart: () => void;
}) {
  return (
    <section style={{ padding: "80px 0", background: "var(--bg-page)", borderTop: "1px solid var(--border)" }}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 12 }}>Detection modes</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
            Text and voice — covered
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="card" style={{ padding: "32px 28px" }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <FileText size={20} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em", marginBottom: 10 }}>Text Detection</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 20 }}>
              Check whether written content was likely created by AI. Paste any article, essay, email, or document. The analysis highlights the words and patterns that raised a flag.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {["Word-level importance highlighting", "AI vs. human probability breakdown", "Readable explanation of findings"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
            <button onClick={onTextStart} className="btn-primary" style={{ padding: "10px 20px" }}>
              Check Text <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Voice */}
          <motion.div
            initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }}
            className="card" style={{ padding: "32px 28px" }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Mic size={20} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em", marginBottom: 10 }}>Voice Detection</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 20 }}>
              Check whether a voice recording sounds synthetic or manipulated. Upload or record audio and see exactly which sections were flagged and why.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {["Waveform view with suspicious highlights", "Exact timestamps of suspicious sections", "Multi-branch analysis with explanations"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
            <button onClick={onVoiceStart} className="btn-secondary" style={{ padding: "10px 20px" }}>
              Check Voice <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ──────────────────────────────────────────────────────────── */
export function FinalCTASection({ onStart }: { onStart: () => void }) {
  return (
    <section style={{ background: "#09090B", padding: "96px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(124,58,237,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "50%", height: "1px", background: "linear-gradient(to right, transparent, rgba(124,58,237,0.4), transparent)" }} />

      <div className="page-container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, color: "#FAFAFA", letterSpacing: "-0.03em", fontFamily: "var(--font-heading)", marginBottom: 16, lineHeight: 1.1 }}>
            Start verifying content{" "}
            <span style={{ color: "#7C3AED" }}>in seconds.</span>
          </h2>
          <p style={{ fontSize: 16, color: "#A1A1AA", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>
            No account needed. Upload your content and get a clear, explained result right now.
          </p>
          <button
            onClick={onStart}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", borderRadius: 8, fontSize: 16, fontWeight: 600,
              background: "#7C3AED", color: "#fff", border: "none", cursor: "pointer",
              transition: "background 0.15s", fontFamily: "var(--font-body)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#6D28D9"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#7C3AED"; }}
          >
            Run Detection <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
