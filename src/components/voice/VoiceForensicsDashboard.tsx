"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2, Waves, Radio, Mic, Layers, Activity, Brain,
  ChevronDown, ChevronUp, Upload, Square, Play, Trash2,
  CheckCircle, Loader2, RotateCcw, Download, RefreshCw,
} from "lucide-react";

/* ── Constants ──────────────────────────────────────────────────────────── */
const TOTAL_DURATION = 6.0;

const SUSPICIOUS_SECTIONS = [
  { start: 1.20, end: 2.10, confidence: 87, label: "01.20s – 02.10s" },
  { start: 4.80, end: 5.60, confidence: 79, label: "04.80s – 05.60s" },
];

const isSus = (t: number) => SUSPICIOUS_SECTIONS.some(s => t >= s.start && t <= s.end);

const WAVEFORM = Array.from({ length: 80 }, (_, i) => ({
  h: Math.abs(Math.sin(i * 0.41 + 0.3) * 0.55 + Math.cos(i * 0.71) * 0.15 + 0.22),
  suspicious: isSus((i / 80) * TOTAL_DURATION),
}));

const MEL_ROWS = 10;
const MEL_COLS = 80;
const MEL_DATA: number[][] = Array.from({ length: MEL_ROWS }, (_, row) =>
  Array.from({ length: MEL_COLS }, (_, col) => {
    const t = (col / MEL_COLS) * TOTAL_DURATION;
    const susBoost = isSus(t) ? 0.44 : 0;
    const base = Math.abs(Math.sin(col * 0.28 + row * 0.5)) * 0.28 + 0.08;
    const rowBoost = ((MEL_ROWS - row) / MEL_ROWS) * 0.18;
    return Math.min(1, base + rowBoost + susBoost);
  })
);

const BRANCHES = [
  { id: "spectral", label: "Frequency Analysis", subtitle: "Analyzes spectral patterns", Icon: BarChart2, score: 91.4, features: ["40 frequency coefficients", "8-layer deep analysis", "4-second listening window"], verdict: "Synthetic" },
  { id: "spectrotemporal", label: "Voice Pattern Analysis", subtitle: "Checks speech structure over time", Icon: Waves, score: 88.7, features: ["Graph-based voice model", "23-node spectral graph", "17-node time graph"], verdict: "Synthetic" },
  { id: "temporal", label: "Time-Based Analysis", subtitle: "Examines audio frame by frame", Icon: Radio, score: 94.2, features: ["Large-scale voice model", "Trained on 5 datasets", "20ms frame resolution"], verdict: "Synthetic" },
  { id: "physiological", label: "Speech Behavior Analysis", subtitle: "Checks natural vocal characteristics", Icon: Mic, score: 85.6, features: ["Vocal cord irregularity check", "Noise-to-signal ratio", "Pitch tremor analysis"], verdict: "Synthetic" },
];

const FUSION_WEIGHTS = [
  { label: "Frequency Analysis", weight: 0.28 },
  { label: "Voice Pattern Analysis", weight: 0.24 },
  { label: "Time-Based Analysis", weight: 0.31 },
  { label: "Speech Behavior", weight: 0.17 },
];

const SHAP_FEATURES = [
  { name: "Pitch irregularity",     impact: +0.34, positive: true  },
  { name: "Vocal cord closure",     impact: +0.28, positive: true  },
  { name: "Tremor pattern",         impact: +0.22, positive: true  },
  { name: "Noise level",            impact: +0.18, positive: true  },
  { name: "Frequency coefficient",  impact: +0.15, positive: true  },
  { name: "Spectral energy spread", impact: +0.11, positive: true  },
  { name: "Pitch stability",        impact: -0.09, positive: false },
  { name: "Breathiness",            impact: -0.12, positive: false },
];

const ANALYSIS_STEPS = [
  { label: "Preparing audio",           detail: "Loading and validating your audio file" },
  { label: "Checking voice patterns",   detail: "Running spectral frequency analysis" },
  { label: "Finding suspicious sections", detail: "Detecting synthetic voice regions" },
  { label: "Preparing result",          detail: "Generating explanation and report" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any } },
});

/* ── Types ──────────────────────────────────────────────────────────────── */
type VoiceState = "idle" | "ready" | "running" | "done";
type AudioMode  = "upload" | "record";
type RecordState = "idle" | "recording" | "done";
type AudioView  = "waveform" | "spectrogram";
interface AudioFile { name: string; size: string; url: string; }

/* ── BranchCard ─────────────────────────────────────────────────────────── */
function BranchCard({ b, delay }: { b: typeof BRANCHES[0]; delay: number }) {
  const [open, setOpen] = useState(false);
  const { Icon } = b;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any }}
      className="glass glass-hover" style={{ padding: 18 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={14} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{b.label}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>{b.subtitle}</div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: "var(--accent-light)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}>
          {b.verdict}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: 48, height: 48, transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="14" />
            <motion.circle cx="50" cy="50" r="38" fill="none" stroke="var(--accent)" strokeWidth="14"
              strokeLinecap="round" strokeDasharray="238.8"
              initial={{ strokeDashoffset: 238.8 }}
              animate={{ strokeDashoffset: 238.8 * (1 - b.score / 100) }}
              transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
            />
          </svg>
          <div className="mono" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--accent)" }}>
            {Math.round(b.score)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-track">
            <motion.div className="progress-fill progress-indigo" initial={{ width: 0 }} animate={{ width: `${b.score}%` }} transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }} />
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Confidence: {b.score.toFixed(1)}%</div>
        </div>
      </div>
      <button onClick={() => setOpen(o => !o)} className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 11, padding: "5px 10px" }}>
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        {open ? "Hide" : "Show"} Details
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 5, borderTop: "1px solid var(--border)", marginTop: 10 }}>
              {b.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "var(--text-secondary)" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Combined Decision Panel ────────────────────────────────────────────── */
function CombinedDecisionPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={15} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Combined AI Decision</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>All four analyses weighted together</div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 26, fontWeight: 900, color: "var(--accent)" }}>90.2%</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {FUSION_WEIGHTS.map((fw, i) => (
          <div key={fw.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{fw.label}</span>
              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{(fw.weight * 100).toFixed(0)}%</span>
            </div>
            <div className="progress-track">
              <motion.div className="progress-fill progress-indigo" initial={{ width: 0 }} animate={{ width: `${fw.weight * 100}%` }} transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--accent-light)", border: "1px solid var(--border-accent)", borderLeft: "3px solid var(--accent)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Synthetic Voice Detected</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Combined confidence: 90.2%</div>
        </div>
      </div>
    </div>
  );
}

/* ── Suspicious Audio Panel ─────────────────────────────────────────────── */
function SuspiciousAudioPanel() {
  const [view, setView] = useState<AudioView>("waveform");

  const TAB_BTN = (active: boolean): React.CSSProperties => ({
    padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: active ? 600 : 500,
    color: active ? "var(--accent)" : "var(--text-secondary)",
    background: active ? "var(--accent-light)" : "transparent",
    border: "none", cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-body)",
  });

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={15} color="var(--text-secondary)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Suspicious Audio Sections</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Parts of audio most likely to be AI-generated</div>
          </div>
        </div>
        <span className="badge badge-violet">2 regions</span>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 3, gap: 2, width: "fit-content", marginBottom: 12 }}>
        <button style={TAB_BTN(view === "waveform")} onClick={() => setView("waveform")}>Waveform</button>
        <button style={TAB_BTN(view === "spectrogram")} onClick={() => setView("spectrogram")}>Mel-Spectrogram</button>
      </div>

      {/* Visualization */}
      <AnimatePresence mode="wait">
        {view === "waveform" ? (
          <motion.div key="waveform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ background: "var(--bg-surface)", borderRadius: 10, padding: "14px 14px 10px", border: "1px solid var(--border)", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 64 }}>
                {WAVEFORM.map((seg, i) => (
                  <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.004, duration: 0.2 }}
                    style={{ flex: 1, borderRadius: 2, height: `${Math.min(seg.h, 1) * 100}%`, background: seg.suspicious ? "var(--accent)" : "#C4B5FD", opacity: seg.suspicious ? 1 : 0.55, transformOrigin: "bottom", minWidth: 2 }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {["0s", "1s", "2s", "3s", "4s", "5s", "6s"].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="spectrogram" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ background: "#0A0A0B", borderRadius: 10, padding: "12px 12px 8px", border: "1px solid var(--border)", marginBottom: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 6 }}>
                {MEL_DATA.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", height: 7 }}>
                    {row.map((val, ci) => (
                      <div key={ci} style={{ flex: 1, height: "100%", background: `rgba(167,139,250,${(val * 0.9).toFixed(2)})`, minWidth: 1 }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#71717A", fontFamily: "var(--font-mono)" }}>
                {["0s", "1s", "2s", "3s", "4s", "5s", "6s"].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 10 }}>
              Brighter purple = higher energy. Suspicious regions appear as intensity spikes across frequency bands.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div style={{ display: "flex", gap: 18, fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 7, borderRadius: 2, background: "var(--accent)" }} /> Suspicious
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 7, borderRadius: 2, background: "#C4B5FD" }} /> Normal
        </div>
      </div>

      {/* Timestamp list */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 8 }}>
        Suspicious sections found:
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {SUSPICIOUS_SECTIONS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg-surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
            <span className="mono" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: "auto" }}>{s.confidence}% likely synthetic</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 14px", background: "var(--accent-light)", borderRadius: 8, border: "1px solid var(--border-accent)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        The highlighted areas show where the system found voice patterns less likely to come from natural human speech.
      </div>
    </div>
  );
}

/* ── Voice Feature Explanation Panel ───────────────────────────────────── */
function VoiceFeatureExplanationPanel() {
  const [reportState, setReportState] = useState<"idle" | "loading" | "done">("idle");
  const maxImpact = Math.max(...SHAP_FEATURES.map(f => Math.abs(f.impact)));
  const topSynthetic = SHAP_FEATURES.filter(f => f.positive).sort((a, b) => b.impact - a.impact)[0];
  const topHuman    = SHAP_FEATURES.filter(f => !f.positive).sort((a, b) => a.impact - b.impact)[0];

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={15} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Voice Feature Explanation</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Which voice properties influenced the result</div>
          </div>
        </div>
        <span className="badge badge-violet">Explainability</span>
      </div>

      {/* Final decision */}
      <div style={{ background: "var(--accent-light)", border: "1px solid var(--border-accent)", borderLeft: "3px solid var(--accent)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 4 }}>
          Final Decision: Synthetic voice detected
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Combined confidence across all analysis branches:{" "}
          <span className="mono" style={{ color: "var(--accent)", fontWeight: 700 }}>90.2%</span>
        </div>
      </div>

      {/* Key indicators */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: "12px 14px", background: "var(--bg-surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 5 }}>Main synthetic indicator</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>{topSynthetic.name}</div>
        </div>
        <div style={{ padding: "12px 14px", background: "var(--bg-surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 5 }}>Main real-voice indicator</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{topHuman.name}</div>
        </div>
      </div>

      {/* Score range */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 12, padding: "0 2px" }}>
        <span>Base score: <span className="mono" style={{ color: "var(--text-primary)" }}>0.50</span></span>
        <span>Final score: <span className="mono" style={{ color: "var(--accent)", fontWeight: 700 }}>0.902</span></span>
      </div>

      {/* Feature bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {SHAP_FEATURES.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div style={{ width: 130, fontSize: 11, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0 }}>{f.name}</div>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Math.abs(f.impact) / maxImpact) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as any }}
                style={{ height: 24, borderRadius: "0 7px 7px 0", display: "flex", alignItems: "center", padding: "0 8px", background: f.positive ? "var(--accent)" : "var(--accent-light)", border: f.positive ? "none" : "1px solid var(--border-accent)", minWidth: 40 }}
              >
                <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: f.positive ? "#fff" : "var(--accent)", whiteSpace: "nowrap" }}>
                  {f.positive ? "+" : ""}{f.impact.toFixed(2)}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 7, borderRadius: 3, background: "var(--accent)" }} /> Pushes toward synthetic
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 7, borderRadius: 3, background: "var(--accent-light)", border: "1px solid var(--border-accent)" }} /> Pushes toward human
        </div>
      </div>

      {/* Written explanation */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 8 }}>Why this voice was flagged</div>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 8 }}>
          The analysis found strong signs of artificial voice generation. The voice showed irregular pitch movements and unnatural vocal cord patterns that differ significantly from natural human speech. Two regions — 1.20s–2.10s and 4.80s–5.60s — had the most unusual voice structure.
        </p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.75 }}>
          While some natural-sounding characteristics like pitch stability were present, they were not strong enough to override the synthetic indicators. Overall, the voice is most consistent with AI-generated speech.
        </p>
      </div>

      {/* Report summary */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Report summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            ["Verdict",              "Synthetic Voice"],
            ["Overall confidence",   "90.2%"],
            ["Main synthetic signal","Pitch irregularity (+0.34)"],
            ["Suspicious regions",   "2 detected"],
            ["Analysis branches",    "4 (all synthetic)"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--text-secondary)" }}>{k}</span>
              <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate report button */}
      <button
        className={reportState === "done" ? "btn-secondary" : "btn-primary"}
        onClick={() => { setReportState("loading"); setTimeout(() => setReportState("done"), 2000); }}
        disabled={reportState === "loading"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {reportState === "loading" ? (
          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><RefreshCw size={14} /></motion.div> Generating...</>
        ) : reportState === "done" ? (
          <><CheckCircle size={14} /> Report Ready — Download</>
        ) : (
          <><Download size={14} /> Generate Explanation Report</>
        )}
      </button>
    </div>
  );
}

/* ── Analysis Loading Panel ─────────────────────────────────────────────── */
function AnalysisLoadingPanel({ onDone }: { onDone: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    const timers = ANALYSIS_STEPS.map((_, i) =>
      setTimeout(() => {
        setStepIdx(i);
        if (i === ANALYSIS_STEPS.length - 1) setTimeout(onDone, 500);
      }, i * 900)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pct = Math.round(((stepIdx + 1) / ANALYSIS_STEPS.length) * 100);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div className="glass" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
        <div className="scan-line" />
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={24} color="var(--accent)" />
            </motion.div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Analyzing Voice</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>{ANALYSIS_STEPS[stepIdx]?.detail}</div>
          <div className="progress-track" style={{ marginBottom: 6 }}>
            <motion.div className="progress-fill progress-indigo" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{pct}% complete</div>
        </div>
      </div>
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-label">Progress</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ANALYSIS_STEPS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: i <= stepIdx ? 1 : 0.3 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {i < stepIdx ? (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={10} color="#fff" />
                </div>
              ) : i === stepIdx ? (
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-light)", border: "1.5px solid var(--accent)", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid var(--border)", flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 13, color: i < stepIdx ? "var(--text-primary)" : i === stepIdx ? "var(--accent)" : "var(--text-muted)" }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Audio Input Panel ──────────────────────────────────────────────────── */
function AudioInputPanel({
  file, onFileReady, onClear, disabled,
}: {
  file: AudioFile | null;
  onFileReady: (f: AudioFile) => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const [mode, setMode]             = useState<AudioMode>("upload");
  const [dragging, setDragging]     = useState(false);
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [recordSecs, setRecordSecs] = useState(0);
  const [bars, setBars]             = useState<number[]>(Array(36).fill(0.1));

  const mediaRef    = useRef<MediaRecorder | null>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef      = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("audio/")) return;
    const url = URL.createObjectURL(f);
    const kb = f.size < 1_048_576 ? `${(f.size / 1024).toFixed(1)} KB` : `${(f.size / 1_048_576).toFixed(2)} MB`;
    onFileReady({ name: f.name, size: kb, url });
  }, [onFileReady]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyserRef.current = analyser;
      const mr = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onFileReady({ name: "recorded_audio.webm", size: `${(blob.size / 1024).toFixed(1)} KB`, url: URL.createObjectURL(blob) });
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecordState("recording");
      setRecordSecs(0);
      timerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        setBars(Array.from({ length: 36 }, (_, i) => (data[Math.floor(i * data.length / 36)] / 255) * 0.9 + 0.05));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      alert("Microphone permission denied. Please allow microphone access and try again.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    mediaRef.current?.stop();
    setRecordState("done");
    setBars(Array(36).fill(0.1));
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const clearAll = () => {
    onClear();
    setRecordState("idle");
    setRecordSecs(0);
    setBars(Array(36).fill(0.1));
  };

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? "var(--accent)" : "var(--text-secondary)",
    background: active ? "var(--accent-light)" : "transparent",
    transition: "all 0.15s", fontFamily: "var(--font-body)",
  });

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", opacity: disabled ? 0.65 : 1, transition: "opacity 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3, background: "var(--bg-page)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
          <button style={TAB_STYLE(mode === "upload")} onClick={() => { setMode("upload"); clearAll(); }} disabled={disabled}>
            <Upload size={12} style={{ display: "inline", marginRight: 5 }} />Upload File
          </button>
          <button style={TAB_STYLE(mode === "record")} onClick={() => { setMode("record"); clearAll(); }} disabled={disabled}>
            <Mic size={12} style={{ display: "inline", marginRight: 5 }} />Record Audio
          </button>
        </div>
        {file && (
          <button onClick={clearAll} disabled={disabled} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, padding: "5px 11px", borderRadius: 7, background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            <Trash2 size={11} /> Remove
          </button>
        )}
      </div>

      <div style={{ padding: 18 }}>
        <AnimatePresence mode="wait">
          {/* File loaded — always takes priority */}
          {file ? (
            <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "var(--bg-surface)", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={18} color="var(--accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{file.size} · Ready for analysis</div>
                </div>
                <span className="badge badge-violet">Ready</span>
              </div>
              <audio controls src={file.url} style={{ width: "100%", borderRadius: 8, outline: "none", height: 38 }} />
              {mode === "record" && (
                <button onClick={startRecording} className="btn-secondary" style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>
                  <Mic size={12} /> Record Again
                </button>
              )}
            </motion.div>
          ) : mode === "upload" ? (
            /* Upload idle */
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 12, padding: "36px 24px", textAlign: "center", background: dragging ? "var(--accent-light)" : "var(--bg-surface)", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-page)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Upload size={20} color="var(--accent)" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5, fontFamily: "var(--font-heading)" }}>Drop your audio file here</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>
                  or <span style={{ color: "var(--accent)", fontWeight: 600 }}>browse files</span> — supports{" "}
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>.wav</span> and{" "}
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>.mp3</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Minimum 3 seconds · Maximum 30 MB</div>
                <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              </div>
            </motion.div>
          ) : recordState === "idle" ? (
            /* Record idle */
            <motion.div key="rec-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", cursor: "pointer" }} onClick={startRecording}>
                  <Mic size={26} color="var(--accent)" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5, fontFamily: "var(--font-heading)" }}>Click to start recording</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18 }}>Speak clearly — at least 3 seconds recommended</div>
                <button onClick={startRecording} className="btn-primary" style={{ padding: "9px 26px" }}>
                  <Mic size={14} /> Start Recording
                </button>
              </div>
            </motion.div>
          ) : (
            /* Recording in progress */
            <motion.div key="rec-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2.5, height: 50, marginBottom: 18 }}>
                  {bars.map((h, i) => (
                    <motion.div key={i} animate={{ height: `${h * 100}%` }} transition={{ duration: 0.08 }}
                      style={{ width: 5, borderRadius: 3, background: "var(--accent)", opacity: 0.6 + h * 0.4, minHeight: 3 }} />
                  ))}
                </div>
                <div className="mono" style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "0.04em", marginBottom: 6 }}>
                  {fmtTime(recordSecs)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 18 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "blink 0.9s ease-in-out infinite" }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Recording in progress...</span>
                </div>
                <button onClick={stopRecording} className="btn-secondary" style={{ padding: "9px 26px" }}>
                  <Square size={14} fill="currentColor" /> Stop Recording
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Export ────────────────────────────────────────────────────────── */
export function VoiceForensicsDashboard() {
  const [analysis, setAnalysis] = useState<VoiceState>("idle");
  const [file, setFile]         = useState<AudioFile | null>(null);

  const handleFileReady = (f: AudioFile) => { setFile(f); setAnalysis("ready"); };
  const handleClear     = () => { setFile(null); setAnalysis("idle"); };
  const resetAll        = () => { setFile(null); setAnalysis("idle"); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <motion.div {...fadeUp()} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>Voice Detection</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-heading)" }}>
            Detect <span style={{ color: "var(--accent)" }}>Synthetic Voice</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            Upload or record audio to check if the voice is AI-generated.
          </p>
        </div>
        {analysis === "done" && (
          <button onClick={resetAll} className="btn-ghost" style={{ flexShrink: 0 }}>
            <RotateCcw size={13} /> Analyze New Audio
          </button>
        )}
      </motion.div>

      {/* Audio input — visible when idle or ready */}
      <AnimatePresence>
        {(analysis === "idle" || analysis === "ready") && (
          <motion.div key="input" {...fadeUp(0.05)}>
            <AudioInputPanel file={file} onFileReady={handleFileReady} onClear={handleClear} disabled={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze button — visible when ready */}
      <AnimatePresence>
        {analysis === "ready" && (
          <motion.div key="btn" {...fadeUp(0.08)} exit={{ opacity: 0, y: -6 }} style={{ display: "flex", justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => setAnalysis("running")} style={{ padding: "12px 40px", fontSize: 15, borderRadius: 10, gap: 10 }}>
              <Play size={16} fill="currentColor" /> Analyze Voice
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {analysis === "running" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalysisLoadingPanel onDone={() => setAnalysis("done")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {analysis === "done" && (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Verdict */}
            <div style={{ background: "var(--accent-light)", border: "1px solid var(--border-accent)", borderLeft: "3px solid var(--accent)", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg-page)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Activity size={18} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-heading)" }}>Synthetic Voice Detected</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  Confidence: <span className="mono" style={{ color: "var(--accent)", fontWeight: 700 }}>90.2%</span>
                </div>
              </div>
              <span className="badge badge-violet">High Confidence</span>
            </div>

            {/* 4-branch grid */}
            <div>
              <div className="section-label"><Radio size={10} /> Analysis Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {BRANCHES.map((b, i) => <BranchCard key={b.id} b={b} delay={i * 0.07} />)}
              </div>
            </div>

            {/* Combined + Suspicious */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <motion.div {...fadeUp(0.1)}><CombinedDecisionPanel /></motion.div>
              <motion.div {...fadeUp(0.14)}><SuspiciousAudioPanel /></motion.div>
            </div>

            {/* Feature explanation */}
            <motion.div {...fadeUp(0.18)}>
              <VoiceFeatureExplanationPanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
