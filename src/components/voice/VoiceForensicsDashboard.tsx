"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Waves,
  Radio,
  Mic,
  Layers,
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
  Upload,
  Square,
  Play,
  Trash2,
  CheckCircle,
} from "lucide-react";

const BRANCHES = [
  {
    id: "spectral",
    label: "Spectral Analysis",
    subtitle: "LFCC + TCN",
    Icon: BarChart2,
    accent: "var(--accent)",
    iconBg: "var(--accent-light)",
    score: 91.4,
    features: [
      "LFCC Coefficients: 40D",
      "TCN Depth: 8 layers",
      "Receptive Field: 4096ms",
    ],
    verdict: "SYNTHETIC",
  },
  {
    id: "spectrotemporal",
    label: "Spectro-Temporal",
    subtitle: "AASIST Graph",
    Icon: Waves,
    accent: "#22C55E",
    iconBg: "#F0FDF4",
    score: 88.7,
    features: [
      "RawGAT-ST Layer",
      "Spectral Graph: 23 nodes",
      "Temporal Graph: 17 nodes",
    ],
    verdict: "SYNTHETIC",
  },
  {
    id: "temporal",
    label: "Temporal Modeling",
    subtitle: "WavLM / XLSR-53",
    Icon: Radio,
    accent: "#7C3AED",
    iconBg: "#EDE9FF",
    score: 94.2,
    features: [
      "WavLM-Large 94 layers",
      "Fine-tuned: ASVspoof5",
      "Frame Shift: 20ms",
    ],
    verdict: "SYNTHETIC",
  },
  {
    id: "physiological",
    label: "Physiological",
    subtitle: "Glottal Source Analysis",
    Icon: Mic,
    accent: "#D97706",
    iconBg: "#FFFBEB",
    score: 85.6,
    features: ["GCI Detection: SEDREAMS", "HNR Ratio: −4.2 dB", "Jitter: 8.3%"],
    verdict: "SYNTHETIC",
  },
];

const FUSION_WEIGHTS = [
  { label: "Spectral (LFCC+TCN)", weight: 0.28, color: "var(--accent)" },
  { label: "Spectro-Temporal (AASIST)", weight: 0.24, color: "#22C55E" },
  { label: "Temporal (WavLM)", weight: 0.31, color: "#7C3AED" },
  { label: "Physiological (GSA)", weight: 0.17, color: "#D97706" },
];

const SHAP_FEATURES = [
  { name: "Jitter (local)", impact: +0.34, positive: true },
  { name: "Glottal Closure Irreg.", impact: +0.28, positive: true },
  { name: "Shimmer (APQ11)", impact: +0.22, positive: true },
  { name: "HNR Ratio", impact: +0.18, positive: true },
  { name: "LFCC-Δ Coefficient", impact: +0.15, positive: true },
  { name: "F0 Tremor Rate", impact: -0.09, positive: false },
  { name: "Breathiness Index", impact: -0.12, positive: false },
  { name: "Spectral Flux", impact: +0.11, positive: true },
];

const WAVEFORM = Array.from({ length: 80 }, (_, i) => ({
  h: Math.random() * 0.65 + 0.1,
  suspicious: (i >= 18 && i <= 33) || (i >= 54 && i <= 68),
}));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  },
});

// ── Branch Card ──────────────────────────────────────────────────────────────
function BranchCard({ b, delay }: { b: (typeof BRANCHES)[0]; delay: number }) {
  const [open, setOpen] = useState(false);
  const { Icon } = b;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
      className="glass glass-hover"
      style={{ padding: 20, cursor: "default" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: b.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={15} color={b.accent} />
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {b.label}
            </div>
            <div
              style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}
            >
              {b.subtitle}
            </div>
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid rgba(239,68,68,0.25)",
            fontFamily: "var(--font-body)",
          }}
        >
          {b.verdict}
        </span>
      </div>

      {/* Score ring + bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Ring */}
        <div
          style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width: 52, height: 52, transform: "rotate(-90deg)" }}
          >
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="var(--border)"
              strokeWidth="14"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={b.accent}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="238.8"
              initial={{ strokeDashoffset: 238.8 }}
              animate={{ strokeDashoffset: 238.8 * (1 - b.score / 100) }}
              transition={{
                duration: 1.2,
                delay: delay + 0.2,
                ease: "easeOut",
              }}
            />
          </svg>
          <div
            className="mono"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: b.accent,
            }}
          >
            {Math.round(b.score)}
          </div>
        </div>
        {/* Bar */}
        <div style={{ flex: 1 }}>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              style={{ background: b.accent }}
              initial={{ width: 0 }}
              animate={{ width: `${b.score}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            />
          </div>
          <div
            style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5 }}
          >
            Confidence: {b.score.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Toggle features */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost"
        style={{
          width: "100%",
          justifyContent: "center",
          fontSize: 11,
          padding: "6px 12px",
        }}
      >
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {open ? "Hide" : "Show"} Features
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 5,
                borderTop: "1px solid var(--border)",
                marginTop: 12,
              }}
            >
              {b.features.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ color: b.accent, fontSize: 7 }}>◆</span>
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

// ── Adaptive Fusion ──────────────────────────────────────────────────────────
function FusionPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Layers size={16} color="var(--accent)" />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Adaptive Fusion
            </div>
            <div
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
            >
              Attention-Based Weight Combination
            </div>
          </div>
        </div>
        <div
          className="mono gradient-text-violet"
          style={{ fontSize: 28, fontWeight: 900 }}
        >
          90.2%
        </div>
      </div>

      {/* Weight bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {FUSION_WEIGHTS.map((fw, i) => (
          <div key={fw.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: fw.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "var(--text-secondary)" }}>
                  {fw.label}
                </span>
              </div>
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {(fw.weight * 100).toFixed(0)}%
              </span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{ background: fw.color }}
                initial={{ width: 0 }}
                animate={{ width: `${fw.weight * 100}%` }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div
        style={{
          background: "#FEF2F2",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--error)",
            flexShrink: 0,
            animation: "pulse-ring 1.5s ease-out infinite",
          }}
        />
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#DC2626",
              fontFamily: "var(--font-heading)",
            }}
          >
            SYNTHETIC VOICE DETECTED
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            Fused Confidence: 90.2% | Threshold: 70%
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Waveform Panel ───────────────────────────────────────────────────────────
function WaveformPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#F0FDF4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={16} color="#22C55E" />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Temporal Localization
            </div>
            <div
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
            >
              ESVAS — Attention Rollout Highlighting
            </div>
          </div>
        </div>
        <span className="badge badge-emerald">Temporal Analysis</span>
      </div>

      {/* Waveform */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 12,
          padding: "16px 16px 12px",
          border: "1px solid var(--border)",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 72,
          }}
        >
          {WAVEFORM.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.006, duration: 0.25 }}
              style={{
                flex: 1,
                borderRadius: 3,
                height: `${seg.h * 100}%`,
                background: seg.suspicious
                  ? "linear-gradient(to top, var(--error), #F97316)"
                  : "var(--accent)",
                opacity: seg.suspicious ? 0.85 : 0.4,
                transformOrigin: "bottom",
                minWidth: 2,
                /* violet glow on suspicious segments */
                boxShadow: seg.suspicious
                  ? "0 0 12px rgba(239,68,68,0.4)"
                  : "none",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 9,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {["0.0s", "1.0s", "2.0s", "3.0s", "4.0s"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 20,
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 8,
              borderRadius: 3,
              background: "linear-gradient(to right, var(--error), #F97316)",
            }}
          />
          Suspicious Segments
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 8,
              borderRadius: 3,
              background: "rgba(140,82,255,0.4)",
            }}
          />
          Normal Audio
        </div>
      </div>

      <div
        style={{
          background: "#FEF2F2",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        ⚠ Suspicious at{" "}
        <span
          style={{
            color: "var(--error)",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
          }}
        >
          1.0–1.75s
        </span>{" "}
        and{" "}
        <span
          style={{
            color: "var(--error)",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
          }}
        >
          2.75–3.4s
        </span>{" "}
        — GAN artifact pattern detected
      </div>
    </div>
  );
}

// ── SHAP Panel ───────────────────────────────────────────────────────────────
function SHAPPanel() {
  const maxImpact = Math.max(...SHAP_FEATURES.map((f) => Math.abs(f.impact)));

  return (
    <div className="glass" style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={16} color="var(--accent)" />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              SHAP Waterfall Plot
            </div>
            <div
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
            >
              Semantic Attribution — Acoustic Features
            </div>
          </div>
        </div>
        <span className="badge badge-violet">ESVAS Explainability</span>
      </div>

      {/* Base/output */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 16,
          padding: "0 2px",
        }}
      >
        <span>
          E[f(x)] ={" "}
          <span className="mono" style={{ color: "var(--text-primary)" }}>
            0.50
          </span>{" "}
          (base)
        </span>
        <span>
          f(x) ={" "}
          <span
            className="mono"
            style={{ color: "var(--error)", fontWeight: 700 }}
          >
            0.902
          </span>
        </span>
      </div>

      {/* Dashed baseline */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <div
          style={{
            position: "absolute",
            left: 152,
            right: 0,
            top: 0,
            height: 1,
            borderTop: "2px dashed var(--text-muted)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* SHAP bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SHAP_FEATURES.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                width: 148,
                fontSize: 11,
                color: "var(--text-secondary)",
                textAlign: "right",
                flexShrink: 0,
                lineHeight: 1.3,
              }}
            >
              {f.name}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(Math.abs(f.impact) / maxImpact) * 100}%`,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1] as any,
                }}
                style={{
                  height: 28,
                  borderRadius: "0 8px 8px 0",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  background: f.positive
                    ? "var(--accent)"
                    : "var(--accent-light)",
                  border: f.positive ? "none" : "1px solid var(--border)",
                  minWidth: 48,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: f.positive ? "#fff" : "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.positive ? "+" : ""}
                  {f.impact.toFixed(2)}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 20,
          fontSize: 11,
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
          paddingTop: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 14,
              height: 8,
              borderRadius: 4,
              background: "var(--accent)",
            }}
          />
          Pushes toward SYNTHETIC
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 14,
              height: 8,
              borderRadius: 4,
              background: "var(--accent-light)",
              border: "1px solid var(--border)",
            }}
          />
          Pushes toward HUMAN
        </div>
      </div>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
/* ── Audio Input Panel ──────────────────────────────────────────────────────── */
type AudioMode = "upload" | "record";
type RecordState = "idle" | "recording" | "done";

function AudioInputPanel() {
  const [mode, setMode] = useState<AudioMode>("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string; url: string } | null>(null);
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [recordSecs, setRecordSecs] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(36).fill(0.1));

  const mediaRef   = useRef<MediaRecorder | null>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef     = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Format seconds → mm:ss */
  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* Handle file selection */
  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("audio/")) return;
    const url = URL.createObjectURL(f);
    const kb = f.size < 1_048_576
      ? `${(f.size / 1024).toFixed(1)} KB`
      : `${(f.size / 1_048_576).toFixed(2)} MB`;
    setFile({ name: f.name, size: kb, url });
  }, []);

  /* Drag-and-drop */
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  /* Start recording */
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
        const url = URL.createObjectURL(blob);
        setFile({ name: "recorded_audio.webm", size: `${(blob.size / 1024).toFixed(1)} KB`, url });
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecordState("recording");
      setRecordSecs(0);

      timerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);

      /* Visualizer RAF */
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

  /* Stop recording */
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    mediaRef.current?.stop();
    setRecordState("done");
    setBars(Array(36).fill(0.1));
  };

  /* Cleanup on unmount */
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const clearAudio = () => {
    setFile(null);
    setRecordState("idle");
    setRecordSecs(0);
    setBars(Array(36).fill(0.1));
  };

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? "var(--accent)" : "var(--text-secondary)",
    background: active ? "var(--accent-light)" : "transparent",
    transition: "all 0.15s", fontFamily: "var(--font-body)",
  });

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg-page)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
          <button style={TAB_STYLE(mode === "upload")} onClick={() => { setMode("upload"); clearAudio(); }}>
            <Upload size={12} style={{ display: "inline", marginRight: 6 }} />Upload File
          </button>
          <button style={TAB_STYLE(mode === "record")} onClick={() => { setMode("record"); clearAudio(); }}>
            <Mic size={12} style={{ display: "inline", marginRight: 6 }} />Record Audio
          </button>
        </div>
        {file && (
          <button onClick={clearAudio} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            <Trash2 size={12} /> Remove
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        <AnimatePresence mode="wait">
          {/* ── UPLOAD MODE ── */}
          {mode === "upload" && !file && (
            <motion.div key="upload-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 16, padding: "40px 24px", textAlign: "center",
                  background: dragging ? "var(--accent-light)" : "var(--bg-surface)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Upload size={22} color="var(--accent)" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, fontFamily: "var(--font-heading)" }}>
                  Drop your audio file here
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, fontFamily: "var(--font-body)" }}>
                  or <span style={{ color: "var(--accent)", fontWeight: 600 }}>browse files</span> — supports{" "}
                  <span style={{ color: "#22C55E", fontWeight: 600 }}>.wav</span> and{" "}
                  <span style={{ color: "#22C55E", fontWeight: 600 }}>.mp3</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  Minimum 3 seconds · Maximum 30 MB
                </div>
                <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              </div>
            </motion.div>
          )}

          {/* ── FILE LOADED ── */}
          {file && (
            <motion.div key="file-loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "var(--bg-surface)", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F0FDF4", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={20} color="#22C55E" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{file.size} · Ready for analysis</div>
                </div>
                <span className="badge badge-emerald" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span className="pulse-dot" style={{ background: "#22C55E", color: "#22C55E" }} />
                  Loaded
                </span>
              </div>
              {/* Playback */}
              <audio controls src={file.url} style={{ width: "100%", borderRadius: 10, outline: "none", height: 40 }} />
            </motion.div>
          )}

          {/* ── RECORD MODE — idle ── */}
          {mode === "record" && recordState === "idle" && (
            <motion.div key="record-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-light)", border: "2px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", cursor: "pointer" }}
                  onClick={startRecording}>
                  <Mic size={30} color="var(--accent)" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, fontFamily: "var(--font-heading)" }}>
                  Click to start recording
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  Speak clearly into your microphone — minimum 3 seconds recommended
                </div>
                <button onClick={startRecording} className="btn-primary" style={{ marginTop: 20, padding: "10px 28px" }}>
                  <Mic size={14} /> Start Recording
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RECORD MODE — recording ── */}
          {mode === "record" && recordState === "recording" && (
            <motion.div key="record-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                {/* Live waveform */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 56, marginBottom: 20 }}>
                  {bars.map((h, i) => (
                    <motion.div key={i} animate={{ height: `${h * 100}%` }} transition={{ duration: 0.08 }}
                      style={{ width: 5, borderRadius: 3, background: "var(--accent)", opacity: 0.7 + h * 0.3, minHeight: 4 }} />
                  ))}
                </div>
                {/* Timer */}
                <div className="mono" style={{ fontSize: 28, fontWeight: 900, color: "var(--error)", letterSpacing: "0.04em", marginBottom: 8 }}>
                  {fmtTime(recordSecs)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                  <span className="pulse-dot" style={{ background: "var(--error)", color: "var(--error)" }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Recording in progress...</span>
                </div>
                <button onClick={stopRecording} className="btn-primary" style={{ background: "var(--error)", borderColor: "var(--error)", padding: "10px 28px" }}>
                  <Square size={14} fill="currentColor" /> Stop Recording
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RECORD MODE — done (file set) ── */}
          {mode === "record" && recordState === "done" && file && (
            <motion.div key="record-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "var(--bg-surface)", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F0FDF4", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={20} color="#22C55E" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{file.size} · Recording complete</div>
                </div>
                <span className="badge badge-emerald" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Play size={10} /> Recorded
                </span>
              </div>
              <audio controls src={file.url} style={{ width: "100%", borderRadius: 10, height: 40 }} />
              <button onClick={startRecording} className="btn-secondary" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
                <Mic size={13} /> Record Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function VoiceForensicsDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <motion.div
        {...fadeUp()}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>
            Voice Detection Module
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-heading)",
            }}
          >
            Analysis <span className="gradient-text-violet">Engine</span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 6,
            }}
          >
             AASIST + WavLM-Large + ESVAS — Explainable Voice Detection
          </p>
        </div>
      </motion.div>

      {/* Audio Input Panel */}
      <motion.div {...fadeUp(0.05)}>
        <AudioInputPanel />
      </motion.div>

      {/* 4-branch grid */}
      <div>
        <div className="section-label">
          <Radio size={11} color="var(--accent)" />
          Multi-Branch Parallel Analysis
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {BRANCHES.map((b, i) => (
            <BranchCard key={b.id} b={b} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* Fusion + Waveform */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <motion.div {...fadeUp(0.3)}>
          <FusionPanel />
        </motion.div>
        <motion.div {...fadeUp(0.35)}>
          <WaveformPanel />
        </motion.div>
      </div>

      {/* SHAP */}
      <motion.div {...fadeUp(0.4)}>
        <SHAPPanel />
      </motion.div>
    </div>
  );
}

