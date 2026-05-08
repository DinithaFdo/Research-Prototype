"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Mic, Cpu, CheckCircle, Download,
  AlertTriangle, Eye, Brain, Activity, Zap, RefreshCw,
} from "lucide-react";

/* ─── Demo types & data (same as InteractiveDemoPage) ──────────── */
type Mode = "idle" | "uploading" | "processing" | "done";
type FileType = "text" | "voice";

const STEPS_TEXT = [
  "Loading DeBERTa-v3 model weights...",
  "Running ReAct Sanitization Agent...",
  "Extracting token embeddings (768D)...",
  "Computing Attention Rollout matrices...",
  "Applying Integrated Gradients (IG)...",
  "Generating NL detection audit...",
  "Computing AOPC faithfulness score...",
];
const STEPS_VOICE = [
  "Loading AASIST + WavLM-Large models...",
  "Running Spectral branch (LFCC+TCN)...",
  "Running Spectro-Temporal branch (AASIST)...",
  "Running Temporal branch (WavLM-Large)...",
  "Running Physiological analysis (GSA)...",
  "Computing adaptive attention fusion...",
  "Generating ESVAS + SHAP explanations...",
];
const REPORT_TEXT = {
  verdict: "AI GENERATED", confidence: 96.3,
  summary: "Analysis reveals high syntactic uniformity (σ=2.1) and low perplexity (23.4) consistent with large language model output. 14 Unicode homoglyph artifacts were detected and stripped. The DeBERTa-v3 engine assigns 96.3% probability of AI authorship.",
  findings: [
    { label: "Syntactic Uniformity", value: "94%",      Icon: AlertTriangle, accent: "var(--error)" },
    { label: "Perplexity Score",     value: "23.4",     Icon: Zap,           accent: "var(--warning)" },
    { label: "AOPC Faithfulness",    value: "84.7",     Icon: CheckCircle,   accent: "var(--success)" },
    { label: "Homoglyph Artifacts",  value: "14 chars", Icon: Eye,           accent: "var(--accent)" },
  ],
};
const REPORT_VOICE = {
  verdict: "SYNTHETIC VOICE", confidence: 90.2,
  summary: "Voice signal exhibits GAN-synthesis artifacts in two temporal regions (1.0–1.75s, 2.75–3.4s). Jitter (8.3%) and Shimmer (APQ11) deviate from natural speech. Adaptive fusion of four branches yields 90.2% synthetic confidence.",
  findings: [
    { label: "Jitter Irregularity",     value: "91%",      Icon: Activity,      accent: "var(--error)" },
    { label: "Glottal Closure Irreg.",  value: "85%",      Icon: Mic,           accent: "var(--warning)" },
    { label: "WavLM Branch Score",      value: "94.2%",    Icon: Brain,         accent: "var(--accent)" },
    { label: "Suspicious Segments",     value: "2 regions",Icon: AlertTriangle, accent: "var(--error)" },
  ],
};
const WAVEFORM_SEGS = Array.from({ length: 64 }, (_, i) => ({
  h: Math.random() * 0.65 + 0.1,
  sus: (i >= 14 && i <= 25) || (i >= 40 && i <= 52),
}));
const TOKEN_WORDS  = ["The","algorithmic","progression","of","AI","systems","demonstrates","uniform","prose","structure"];
const TOKEN_SCORES = [0.08, 0.92, 0.78, 0.1, 0.95, 0.71, 0.65, 0.91, 0.68, 0.87];

/* ─── Why VeriGuard stats ─────────────────────────────────────── */
const WHY_STATS = [
  { value: "2-in-1",    label: "Detection Modes",      sub: "Text and voice in one platform" },
  { value: "< 2s",      label: "Instant Results",       sub: "From upload to verdict" },
  { value: "Explained", label: "Transparent AI",        sub: "Every result comes with insights" },
  { value: "Free",      label: "Try Without Sign-up",   sub: "Start detecting right now" },
];

const TECH_TAGS = ["DeBERTa-v3","LlamaIndex ReAct","AASIST","WavLM-Large","ESVAS","SHAP","Attention Rollout"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] as any, duration: 0.5 } },
} as unknown as import("framer-motion").Variants;
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as unknown as import("framer-motion").Variants;

/* ─── Drop Zone ──────────────────────────────────────────────── */
function DropZone({ onUpload }: { onUpload: (t: FileType) => void }) {
  const [dragging, setDragging] = useState(false);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onUpload(f.name.endsWith(".wav") || f.name.endsWith(".mp3") ? "voice" : "text");
  }, [onUpload]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 20, padding: "52px 40px", textAlign: "center",
        background: dragging ? "var(--accent-light)" : "var(--bg-surface)",
        transition: "all 0.25s",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "var(--accent-light)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Upload size={28} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, fontFamily: "var(--font-heading)" }}>
            Drop your file here
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Supports <span style={{ color: "var(--accent)", fontWeight: 600 }}>.txt</span> for text analysis or{" "}
            <span style={{ color: "#22C55E", fontWeight: 600 }}>.wav / .mp3</span> for voice analysis
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button id="hero-upload-text-btn" className="btn-primary" onClick={() => onUpload("text")}>
            <FileText size={14} /> Simulate .txt
          </button>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
          <button id="hero-upload-voice-btn" className="btn-secondary" onClick={() => onUpload("voice")}>
            <Mic size={14} /> Simulate .wav
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Processing View ────────────────────────────────────────── */
function ProcessingView({ fileType, onDone }: { fileType: FileType; onDone: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = fileType === "text" ? STEPS_TEXT : STEPS_VOICE;
  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => {
      setStepIdx(i);
      if (i === steps.length - 1) setTimeout(onDone, 700);
    }, i * 650));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pct = Math.round(((stepIdx + 1) / steps.length) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="glass" style={{ padding: 40, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="scan-line" />
        <div style={{ position: "relative", display: "inline-flex", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent-light)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
              <Cpu size={36} color="var(--accent)" />
            </motion.div>
          </div>
          {[1,2,3].map(r => (
            <motion.div key={r} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid var(--accent)" }}
              animate={{ scale: [1, 1.4 + r * 0.25], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, delay: r * 0.4, repeat: Infinity }}
            />
          ))}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", marginBottom: 6, fontFamily: "var(--font-heading)" }}>Analysis Pipeline</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Processing your content...</div>
        <div style={{ maxWidth: 320, margin: "0 auto 10px" }}>
          <div className="progress-track" style={{ height: 8 }}>
            <motion.div className="progress-fill progress-indigo" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{pct}% complete</div>
      </div>
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-label">Pipeline Log</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: i <= stepIdx ? 1 : 0.3 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i < stepIdx ? (
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={12} color="#fff" />
                </div>
              ) : i === stepIdx ? (
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent-light)", border: "2px solid var(--accent)", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid var(--border)", flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 13, color: i < stepIdx ? "var(--text-primary)" : i === stepIdx ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Result View ────────────────────────────────────────────── */
function ResultView({ fileType, onReset }: { fileType: FileType; onReset: () => void }) {
  const [pdfState, setPdfState] = useState<"idle"|"loading"|"done">("idle");
  const report = fileType === "text" ? REPORT_TEXT : REPORT_VOICE;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "var(--accent-light)", border: "1px solid var(--border)", borderLeft: "4px solid var(--accent)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg-page)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "var(--shadow-card)" }}>
          <AlertTriangle size={22} color="var(--error)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.01em", fontFamily: "var(--font-heading)" }}>{report.verdict}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Overall Confidence: <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 700 }}>{report.confidence}%</span></div>
        </div>
        <span className="badge badge-rose" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="pulse-dot" style={{ background: "var(--error)", color: "var(--error)" }} />
          Detection Alert
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-label"><Eye size={11} color="var(--accent)" /> Evidence Viewer</div>
          {fileType === "text" ? (
            <>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Token Saliency Heatmap</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {TOKEN_WORDS.map((w, i) => (
                  <span key={i} className="mono" style={{ padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: `rgba(140,82,255,${TOKEN_SCORES[i] * 0.25})`, color: TOKEN_SCORES[i] > 0.5 ? "var(--accent)" : "var(--text-secondary)", border: `1px solid rgba(140,82,255,${TOKEN_SCORES[i] * 0.35})` }}>{w}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Audio Waveform + Suspicious Regions</div>
              <div style={{ height: 64, display: "flex", alignItems: "flex-end", gap: 2, background: "var(--bg-surface)", borderRadius: 10, padding: "10px 10px 8px", marginBottom: 20, border: "1px solid var(--border)" }}>
                {WAVEFORM_SEGS.map((s, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 3, height: `${s.h * 100}%`, background: s.sus ? "linear-gradient(to top, var(--error), #F97316)" : "var(--accent)", opacity: s.sus ? 0.85 : 0.35, minWidth: 2 }} />
                ))}
              </div>
            </>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {report.findings.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "14px 12px", border: "1px solid var(--border)" }}>
                <f.Icon size={14} color={f.accent} style={{ marginBottom: 8 }} />
                <div className="mono" style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{f.value}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5 }}>{f.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
          <div className="section-label"><FileText size={11} color="var(--accent)" /> Detection Report</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: 16, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, fontFamily: "var(--font-heading)" }}>AI Detection Summary</div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>{report.summary}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.findings.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <f.Icon size={12} color={f.accent} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{f.label}</span>
                  <span className="mono" style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 700 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <button id="hero-generate-pdf-btn" className="btn-primary" onClick={() => { setPdfState("loading"); setTimeout(() => setPdfState("done"), 2200); }}
              disabled={pdfState === "loading"} style={{ width: "100%", justifyContent: "center", padding: "13px 20px" }}>
              {pdfState === "loading" ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><RefreshCw size={14} /></motion.div> Generating...</>)
                : pdfState === "done" ? (<><CheckCircle size={14} /> Report Generated!</>)
                : (<><Download size={14} /> Generate PDF Report</>)}
            </button>
            <button id="hero-reset-btn" className="btn-secondary" onClick={onReset} style={{ width: "100%", justifyContent: "center" }}>
              <RefreshCw size={14} /> Analyze New File
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export function HeroSection({ onTextStart, onVoiceStart }: { onTextStart: () => void; onVoiceStart: () => void }) {
  const [mode, setMode]         = useState<Mode>("idle");
  const [fileType, setFileType] = useState<FileType>("text");
  const [fileName, setFileName] = useState("");

  const handleUpload = (type: FileType) => {
    setFileType(type);
    setFileName(type === "text" ? "sample_document.txt" : "voice_recording.wav");
    setMode("uploading");
    setTimeout(() => setMode("processing"), 900);
  };

  return (
    <section style={{ padding: "60px 0 72px", position: "relative" }}>
      <motion.div variants={container} initial="hidden" animate="show">

        {/* ── Product description (Quillbot-style) ────────────────── */}
        <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.08, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 16, marginTop: 12 }}>
            Detect AI-Generated Content,{" "}
            <span style={{ color: "var(--accent)" }}>Instantly</span>
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
            Upload a document or audio file and VeriGuard AI tells you instantly whether it was written by AI or if a voice is synthetic with full, explainable insights.
          </p>
        </motion.div>

        {/* ── Drop zone / processing / results ───────────────────── */}
        <motion.div variants={fadeUp} style={{ marginBottom: 48 }}>
          <AnimatePresence mode="wait">
            {mode === "idle" && (
              <motion.div key="idle" exit={{ opacity: 0, y: -10 }}>
                <DropZone onUpload={handleUpload} />
              </motion.div>
            )}
            {mode === "uploading" && (
              <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="glass" style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F0FDF4", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {fileType === "text" ? <FileText size={20} color="#22C55E" /> : <Mic size={20} color="#22C55E" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{fileName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>File validated — initializing pipeline...</div>
                  </div>
                  <span className="badge badge-emerald" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="pulse-dot" style={{ background: "#22C55E", color: "#22C55E" }} /> Queued
                  </span>
                </div>
              </motion.div>
            )}
            {mode === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProcessingView fileType={fileType} onDone={() => setMode("done")} />
              </motion.div>
            )}
            {mode === "done" && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ResultView fileType={fileType} onReset={() => setMode("idle")} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Why VeriGuard stats ──────────────────────────────────── */}
        <motion.div variants={container} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
          {WHY_STATS.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="card" style={{ padding: "24px 16px", textAlign: "center", cursor: "default" }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1, marginBottom: 8, color: "var(--accent)" }}>
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

        {/* ── Tech tags ───────────────────────────────────────────── */}
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {TECH_TAGS.map(t => (
            <span key={t} className="mono" style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, background: "var(--accent-light)", border: "1px solid var(--border)", color: "var(--accent)", letterSpacing: "0.03em" }}>{t}</span>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}
