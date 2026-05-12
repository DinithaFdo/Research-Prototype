"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  FileText,
  Play,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const SAMPLE_TEXT = `The algorithmic progression of artificial intelligence systems demonstrates a remarkable capacity for generating syntactically uniform prose. This systematic approach exhibits characteristic patterns of lexical distribution that deviate significantly from natural human writing styles. The uniformity of sentence structure and the consistent deployment of transitional phrases represent strong indicators of machine-generated content.`;

const ANALYSIS_STEPS = [
  {
    label: "Reviewing content",
    detail: "Checking for hidden characters and anomalies",
  },
  {
    label: "Checking for manipulation",
    detail: "Scanning for invisible characters",
  },
  {
    label: "Detecting AI patterns",
    detail: "Analyzing sentence structure and style",
  },
  {
    label: "Measuring consistency",
    detail: "Evaluating writing style uniformity",
  },
  {
    label: "Running classification",
    detail: "Scoring AI vs. human probability",
  },
  {
    label: "Preparing explanation",
    detail: "Generating readable insight report",
  },
  { label: "Finalizing result", detail: "Everything is ready" },
];

const BRANCH_CARDS = [
  {
    n: "01",
    label: "Writing Pattern Check",
    confidence: 94,
    status: "AI Patterns Found",
  },
  {
    n: "02",
    label: "Sentence Structure Check",
    confidence: 89,
    status: "Uniform Structure",
  },
  {
    n: "03",
    label: "Word Choice Check",
    confidence: 91,
    status: "Formal Vocabulary",
  },
  {
    n: "04",
    label: "Readability Check",
    confidence: 78,
    status: "Low Variation",
  },
];

const CONTRIBUTIONS = [
  { label: "Writing Pattern", pct: 10 },
  { label: "Sentence Structure", pct: 20 },
  { label: "Word Choice", pct: 40 },
  { label: "Readability", pct: 30 },
];

const TOKEN_DATA = [
  { word: "The", score: 0.08 },
  { word: "algorithmic", score: 0.92 },
  { word: "progression", score: 0.78 },
  { word: "of", score: 0.1 },
  { word: "artificial", score: 0.89 },
  { word: "intelligence", score: 0.95 },
  { word: "systems", score: 0.71 },
  { word: "demonstrates", score: 0.65 },
  { word: "a", score: 0.06 },
  { word: "remarkable", score: 0.58 },
  { word: "capacity", score: 0.74 },
  { word: "for", score: 0.09 },
  { word: "generating", score: 0.87 },
  { word: "syntactically", score: 0.96 },
  { word: "uniform", score: 0.91 },
  { word: "prose", score: 0.68 },
];

const WORD_SCORES: Record<string, number> = {
  algorithmic: 0.92,
  progression: 0.78,
  artificial: 0.89,
  intelligence: 0.95,
  systems: 0.71,
  demonstrates: 0.65,
  remarkable: 0.58,
  capacity: 0.74,
  generating: 0.87,
  syntactically: 0.96,
  uniform: 0.91,
  prose: 0.68,
  systematic: 0.85,
  approach: 0.62,
  exhibits: 0.77,
  characteristic: 0.88,
  patterns: 0.83,
  lexical: 0.94,
  distribution: 0.72,
  deviate: 0.69,
  significantly: 0.75,
  natural: 0.45,
  human: 0.38,
  writing: 0.52,
  styles: 0.48,
  uniformity: 0.93,
  sentence: 0.86,
  structure: 0.84,
  consistent: 0.9,
  deployment: 0.81,
  transitional: 0.89,
  phrases: 0.76,
  represent: 0.67,
  strong: 0.61,
  indicators: 0.79,
  machine: 0.94,
  content: 0.55,
  "machine-generated": 0.97,
};

function getWordScore(w: string): number {
  return WORD_SCORES[w.toLowerCase().replace(/[^a-z-]/g, "")] ?? 0.1;
}

const FLAGGED_REASONS = [
  {
    Icon: AlertTriangle,
    label: "Unusually consistent sentence length",
    detail:
      "Human writers vary their sentence lengths naturally. This text has very low variation.",
    score: 94,
  },
  {
    Icon: TrendingUp,
    label: "Uncommon word frequency pattern",
    detail: "The word distribution doesn't match how people naturally write.",
    score: 82,
  },
  {
    Icon: AlertTriangle,
    label: "Hidden characters detected",
    detail:
      "14 invisible Unicode characters were found and removed before analysis.",
    score: 88,
  },
  {
    Icon: AlertTriangle,
    label: "Low text complexity",
    detail:
      "The text is significantly simpler than typical human writing at this level.",
    score: 76,
  },
  {
    Icon: CheckCircle,
    label: "No emotional variation",
    detail:
      "The tone stays flat throughout, which is rare in human-authored content.",
    score: 71,
  },
];

/* ── Text Safety Check Data ─────────────────────────────────────────────── */
type TextCleaningIssue = {
  type: string;
  label: string;
  action: string;
  count: number;
};

type TextCleaningSummary = {
  originalLength: number;
  cleanedLength: number;
  totalIssuesFound: number;
  issues: TextCleaningIssue[];
};

const CLEANING_SUMMARY: TextCleaningSummary = {
  originalLength: 322,
  cleanedLength: 293,
  totalIssuesFound: 29,
  issues: [
    { type: "zero_width", label: "Hidden zero-width characters", action: "Removed invisible characters",  count: 14 },
    { type: "homoglyph",  label: "Unicode lookalike letters",    action: "Converted to normal letters",   count:  5 },
    { type: "spacing",    label: "Extra spacing tricks",         action: "Cleaned spacing",               count:  8 },
    { type: "formatting", label: "Hidden formatting",            action: "Removed unsafe formatting",     count:  2 },
  ],
};

function scoreToStyle(score: number): React.CSSProperties {
  return {
    background: `rgba(124,58,237,${(score * 0.18).toFixed(2)})`,
    color: score > 0.6 ? "var(--accent)" : "var(--text-secondary)",
    border: `1px solid rgba(124,58,237,${(score * 0.25).toFixed(2)})`,
  };
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
  },
});

/* ── Loading Panel ──────────────────────────────────────────────────────── */
function AnalysisLoadingPanel({ onDone }: { onDone: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timers = ANALYSIS_STEPS.map((_, i) =>
      setTimeout(() => {
        setStepIdx(i);
        if (i === ANALYSIS_STEPS.length - 1) setTimeout(onDone, 500);
      }, i * 600),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round(((stepIdx + 1) / ANALYSIS_STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
    >
      <div className="glass" style={{ padding: 28 }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--accent-light)",
              border: "1px solid var(--border-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={24} color="var(--accent)" />
            </motion.div>
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            Analyzing Text
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              marginBottom: 18,
            }}
          >
            {ANALYSIS_STEPS[stepIdx]?.detail}
          </div>
          <div className="progress-track" style={{ marginBottom: 6 }}>
            <motion.div
              className="progress-fill progress-indigo"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--text-muted)" }}
          >
            {pct}% complete
          </div>
        </div>
      </div>
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-label">Progress</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ANALYSIS_STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: i <= stepIdx ? 1 : 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              {i < stepIdx ? (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle size={10} color="#fff" />
                </div>
              ) : i === stepIdx ? (
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    border: "1.5px solid var(--accent)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 13,
                  color:
                    i < stepIdx
                      ? "var(--text-primary)"
                      : i === stepIdx
                        ? "var(--accent)"
                        : "var(--text-muted)",
                }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Branch Cards Row ───────────────────────────────────────────────────── */
function BranchCardsRow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
      {BRANCH_CARDS.map((b, i) => (
        <motion.div
          key={b.n}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="card"
          style={{ padding: "18px 16px" }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-mono)",
              marginBottom: 8,
            }}
          >
            Branch {b.n}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            {b.label}
          </div>
          <div style={{ marginBottom: 8 }}>
            <div className="progress-track" style={{ height: 5 }}>
              <motion.div
                className="progress-fill progress-indigo"
                initial={{ width: 0 }}
                animate={{ width: `${b.confidence}%` }}
                transition={{
                  delay: 0.1 + i * 0.06,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {b.status}
            </span>
            <span
              className="mono"
              style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}
            >
              {b.confidence}%
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── AI-Likely Text Preview ─────────────────────────────────────────────── */
function AILikelyTextPreview({ text }: { text: string }) {
  const parts = text.split(/(\s+)/);
  return (
    <div
      style={{
        lineHeight: 1.9,
        fontSize: 13,
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {parts.map((part, i) => {
        if (/^\s+$/.test(part)) return <span key={i}>{part}</span>;
        const score = getWordScore(part);
        const alpha =
          score > 0.5 ? Number(((score - 0.5) * 0.55).toFixed(2)) : 0;
        return (
          <span
            key={i}
            title={`AI signal: ${(score * 100).toFixed(0)}%`}
            style={{
              background:
                alpha > 0 ? `rgba(124,58,237,${alpha})` : "transparent",
              color: score > 0.75 ? "var(--accent)" : "var(--text-primary)",
              borderRadius: 3,
              padding: alpha > 0 ? "1px 2px" : undefined,
            }}
          >
            {part}
          </span>
        );
      })}
    </div>
  );
}

/* ── Combined Result Section ────────────────────────────────────────────── */
function CombinedResultSection({ text }: { text: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16 }}>
      {/* Left: branch contributions */}
      <div className="glass" style={{ padding: 24 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            marginBottom: 4,
          }}
        >
          Combined Result
        </div>
        <div
          style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 20 }}
        >
          Branch contribution to final score
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 13,
            marginBottom: 22,
          }}
        >
          {CONTRIBUTIONS.map((c, i) => (
            <div key={c.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 5,
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  {c.label}
                </span>
                <span
                  className="mono"
                  style={{ fontWeight: 600, color: "var(--text-primary)" }}
                >
                  {c.pct}%
                </span>
              </div>
              <div className="progress-track" style={{ height: 6 }}>
                <motion.div
                  className="progress-fill progress-indigo"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{
                    delay: 0.1 + i * 0.07,
                    duration: 0.9,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Final AI Probability
            </span>
            <span
              className="mono"
              style={{ fontSize: 24, fontWeight: 900, color: "var(--accent)" }}
            >
              96.3%
            </span>
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}
          >
            AI Generated — High Confidence
          </div>
        </div>
      </div>

      {/* Right: AI-Likely Text Preview */}
      <div className="glass" style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            AI-Likely Text Preview
          </div>
          <span className="badge badge-violet">Word-level view</span>
        </div>
        <div
          style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}
        >
          Stronger purple = higher AI signal. Hover a word for its score.
        </div>
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: 8,
            padding: "14px 16px",
            border: "1px solid var(--border)",
            maxHeight: 170,
            overflowY: "auto",
            marginBottom: 12,
          }}
        >
          <AILikelyTextPreview text={text} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <span>Low signal</span>
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              background:
                "linear-gradient(to right, rgba(124,58,237,0.06), rgba(124,58,237,0.45), rgba(124,58,237,0.95))",
            }}
          />
          <span>High signal</span>
        </div>
      </div>
    </div>
  );
}

/* ── Important Text Highlights ──────────────────────────────────────────── */
function ImportantTextHighlights() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Important Text Highlights
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            Words that most influenced the detection result
          </div>
        </div>
        <span className="badge badge-neutral">Word-level</span>
      </div>

      <div
        style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}
      >
        Darker highlight = stronger AI signal
      </div>

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}
      >
        {TOKEN_DATA.map((t, i) => {
          const style = scoreToStyle(t.score);
          const isHov = hovered === i;
          return (
            <motion.span
              key={i}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ scale: 1.06, y: -1 }}
              className="mono"
              style={{
                padding: "5px 11px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background: isHov ? "var(--accent)" : style.background,
                color: isHov ? "#fff" : style.color,
                border: isHov ? "1px solid var(--accent)" : style.border,
                transition: "background 0.12s, color 0.12s",
              }}
            >
              {t.word}
            </motion.span>
          );
        })}
      </div>

      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Word detail
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                &ldquo;{TOKEN_DATA[hovered].word}&rdquo;
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 7,
              }}
            >
              {[
                [
                  "AI Signal",
                  `${(TOKEN_DATA[hovered].score * 100).toFixed(1)}%`,
                ],
                [
                  "Attention Weight",
                  `${(TOKEN_DATA[hovered].score * 87).toFixed(1)}%`,
                ],
                [
                  "Gradient Score",
                  `${(TOKEN_DATA[hovered].score * 94).toFixed(1)}%`,
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    textAlign: "center",
                    background: "var(--accent-light)",
                    borderRadius: 7,
                    padding: "9px 7px",
                    border: "1px solid var(--border-accent)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--text-muted)",
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {k}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: "var(--text-muted)",
        }}
      >
        <span>Low signal</span>
        <div
          style={{
            flex: 1,
            height: 5,
            borderRadius: 999,
            background:
              "linear-gradient(to right, rgba(124,58,237,0.08), rgba(124,58,237,0.5), rgba(124,58,237,1))",
          }}
        />
        <span>High signal</span>
      </div>
    </div>
  );
}

/* ── Why This Text Was Marked as AI ────────────────────────────────────── */
function WhyMarkedAsAI() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Why This Text Was Marked as AI
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            Plain-language explanation of what was detected
          </div>
        </div>
        <span className="badge badge-neutral">Auto-generated</span>
      </div>

      {/* Plain-language explanation */}
      <div
        style={{
          background: "var(--accent-light)",
          border: "1px solid var(--border-accent)",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 18,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "var(--text-primary)",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          This text was marked as AI-likely because it uses very even sentence
          structure, repeated formal wording, and low variation in writing
          style. The word choices appear unusually consistent, and sentence
          lengths show minimal natural variation — patterns that are rarely seen
          in genuine human writing.This text was marked as AI-likely because it
          uses very even sentence structure, repeated formal wording, and low
          variation in writing style. The word choices appear unusually
          consistent, and sentence lengths show minimal natural variation —
          patterns that are rarely seen in genuine human writing.
        </p>
      </div>

      {/* Detailed signal breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FLAGGED_REASONS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              background: "var(--bg-surface)",
              borderRadius: 10,
              padding: "12px 14px",
              border: "1px solid var(--border)",
            }}
          >
            <f.Icon
              size={14}
              color="var(--accent)"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {f.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                  lineHeight: 1.5,
                }}
              >
                {f.detail}
              </div>
            </div>
            <span
              className="mono"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--accent)",
                flexShrink: 0,
              }}
            >
              {f.score}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Explanation Reliability ────────────────────────────────────────────── */
function ExplanationReliability() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Explanation Reliability
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            How trustworthy this result is — higher is better
          </div>
        </div>
        <span className="badge badge-violet">High Reliability</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div
          style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width: 80, height: 80, transform: "rotate(-90deg)" }}
          >
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="var(--border)"
              strokeWidth="12"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="238.8"
              initial={{ strokeDashoffset: 238.8 }}
              animate={{ strokeDashoffset: 238.8 * (1 - 0.847) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "var(--accent)",
                lineHeight: 1,
              }}
            >
              84.7
            </div>
            <div
              style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 2 }}
            >
              score
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            ["Reliability", "High"],
            ["Verification steps", "20"],
            ["Baseline score", "50.0"],
            ["Confidence metric", "0.912"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 10, fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 140 }}>
                {k}
              </span>
              <span
                className="mono"
                style={{ color: "var(--text-primary)", fontWeight: 600 }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Text Safety Check Panel ────────────────────────────────────────────── */
function TextSafetyCheckPanel({ summary }: { summary: TextCleaningSummary }) {
  const clean = summary.totalIssuesFound === 0;
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Text Safety Check
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            We checked the text for hidden tricks that can affect detection
            accuracy.
          </div>
        </div>
        {clean ? (
          <span className="badge badge-neutral">No Issues Found</span>
        ) : (
          <span className="badge badge-violet">
            {summary.totalIssuesFound} issues fixed
          </span>
        )}
      </div>

      {clean ? (
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: 10,
            padding: "14px 16px",
            border: "1px solid var(--border)",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          No hidden text issues were found. The text was already clean.
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              ["Original Length", `${summary.originalLength} chars`],
              ["Cleaned Length",  `${summary.cleanedLength} chars`],
              ["Issues Removed",  `${summary.totalIssuesFound} found`],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--accent)",
                    marginBottom: 3,
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {k}
                </div>
              </div>
            ))}
          </div>

          {/* Issues table */}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-surface)" }}>
                  {["Issue Found", "What We Did", "Count"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "9px 14px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-heading)",
                        borderBottom: "1px solid var(--border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.issues.map((issue, i) => (
                  <motion.tr
                    key={issue.type}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      borderBottom:
                        i < summary.issues.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {issue.label}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {issue.action}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        {issue.count}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main Export ────────────────────────────────────────────────────────── */
type AnalysisState = "idle" | "running" | "done";

export function TextForensicsDashboard() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [analysis, setAnalysis] = useState<AnalysisState>("idle");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInputText(text);
    } catch {
      document.getElementById("text-input-area")?.focus();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <motion.div
        {...fadeUp()}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>
            Text Detection
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              fontFamily: "var(--font-heading)",
            }}
          >
            Detect AI-Written{" "}
            <span style={{ color: "var(--accent)" }}>Content</span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 6,
            }}
          >
            Paste any text below and click Analyze Text to check if it was
            AI-generated.
          </p>
        </div>
        {analysis === "done" && (
          <button
            onClick={() => setAnalysis("idle")}
            className="btn-ghost"
            style={{ flexShrink: 0 }}
          >
            <RotateCcw size={13} /> New Analysis
          </button>
        )}
      </motion.div>

      {/* Text Input */}
      <motion.div {...fadeUp(0.04)}>
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            opacity: analysis !== "idle" ? 0.65 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg-surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <FileText size={13} color="var(--accent)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Your Text
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                — paste or type content to check
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {inputText.length} chars
              </span>
              <button
                onClick={() => setInputText("")}
                disabled={analysis !== "idle"}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-secondary)";
                }}
              >
                Clear
              </button>
              <button
                id="text-paste-btn"
                onClick={handlePaste}
                className="btn-primary"
                disabled={analysis !== "idle"}
                style={{ fontSize: 12, padding: "5px 14px", borderRadius: 7 }}
              >
                Paste
              </button>
            </div>
          </div>
          <textarea
            id="text-input-area"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={analysis !== "idle"}
            placeholder="Paste or type text here to check if it was AI-generated..."
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: 130,
              padding: "14px 16px",
              fontSize: 13,
              color: "var(--text-primary)",
              lineHeight: 1.75,
              background: "#fff",
              border: "none",
              outline: "none",
              resize: "vertical",
              fontFamily: "var(--font-body)",
              boxSizing: "border-box",
              display: "block",
            }}
          />
        </div>
      </motion.div>

      {/* Analyze Text Button */}
      <AnimatePresence>
        {analysis === "idle" && (
          <motion.div
            {...fadeUp(0.06)}
            exit={{ opacity: 0, y: -6 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              id="analyze-text-btn"
              className="btn-primary"
              onClick={() => setAnalysis("running")}
              disabled={!inputText.trim()}
              style={{
                padding: "12px 36px",
                fontSize: 15,
                borderRadius: 10,
                gap: 10,
              }}
            >
              <Play size={16} fill="currentColor" /> Analyze Text
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {analysis === "running" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisLoadingPanel onDone={() => setAnalysis("done")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {analysis === "done" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Verdict banner */}
            <div
              style={{
                background: "var(--accent-light)",
                border: "1px solid var(--border-accent)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: 12,
                padding: "18px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--bg-page)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={18} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  AI Generated
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  Confidence:{" "}
                  <span
                    className="mono"
                    style={{ color: "var(--accent)", fontWeight: 700 }}
                  >
                    96.3%
                  </span>
                </div>
              </div>
              <span className="badge badge-violet">High Confidence</span>
            </div>

            {/* Branch cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <BranchCardsRow />
            </motion.div>

            {/* Combined Result + AI-Likely Text Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CombinedResultSection text={inputText} />
            </motion.div>

            {/* Important Text Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <ImportantTextHighlights />
            </motion.div>

            {/* Text Safety Check */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.175 }}
            >
              <TextSafetyCheckPanel summary={CLEANING_SUMMARY} />
            </motion.div>

            {/* Why This Text Was Marked as AI */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <WhyMarkedAsAI />
            </motion.div>

            {/* Explanation Reliability */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <ExplanationReliability />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
