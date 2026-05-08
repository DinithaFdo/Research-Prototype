"use client";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Star } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "For individuals and students exploring AI detection features.",
    cta: "Start Free",
    ctaStyle: "secondary" as const,
    popular: false,
    features: [
      "50 text detection checks / month",
      "10 voice detection uploads / month",
      "Basic confidence score",
      "Standard result summary",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "/ month",
    description: "For researchers and creators who need deeper insights and higher usage.",
    cta: "Get Pro",
    ctaStyle: "primary" as const,
    popular: true,
    features: [
      "500 text detection checks / month",
      "100 voice detection uploads / month",
      "Detailed confidence breakdown",
      "Explainable detection insights",
      "Exportable PDF reports",
      "Priority processing",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For institutions and teams requiring secure, scalable detection workflows.",
    cta: "Contact Sales",
    ctaStyle: "secondary" as const,
    popular: false,
    features: [
      "High-volume text and voice detection",
      "Team access and admin controls",
      "Advanced explainability reports",
      "Full API access",
      "Secure data handling",
      "Dedicated support",
    ],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
});

export function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        padding: "100px 0 80px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="page-container">
        {/* Section header */}
        <motion.div
          {...fadeUp(0)}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 16 }}>
            <Star size={10} />
            Simple, Transparent Pricing
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 900, letterSpacing: "-0.03em",
            color: "var(--text-primary)", fontFamily: "var(--font-heading)",
            marginBottom: 14,
          }}>
            Choose the plan that{" "}
            <span className="gradient-text-violet">fits your needs</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
            Start free and scale as your detection needs grow. No hidden fees.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              id={`pricing-card-${plan.id}`}
              {...fadeUp(i * 0.1)}
              style={{
                position: "relative",
                background: plan.popular ? "var(--bg-card)" : "var(--bg-card)",
                border: plan.popular
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border)",
                borderRadius: 20,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.popular
                  ? "var(--shadow-btn), 0 0 0 1px rgba(140,82,255,0.08)"
                  : "var(--shadow-card)",
                transition: "transform 0.2s, box-shadow 0.2s",
                overflow: "hidden",
              }}
              whileHover={{ translateY: -4 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: 4,
                  background: "linear-gradient(90deg, #8C52FF, #C084FC)",
                }} />
              )}
              {plan.popular && (
                <div style={{
                  position: "absolute", top: 18, right: 20,
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "4px 12px", borderRadius: 999,
                  background: "var(--accent)", color: "#fff",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                  fontFamily: "var(--font-body)",
                }}>
                  <Zap size={9} fill="#fff" />
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div style={{ marginBottom: 8, paddingTop: plan.popular ? 4 : 0 }}>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: plan.popular ? "var(--accent)" : "var(--text-primary)",
                  fontFamily: "var(--font-heading)", marginBottom: 6,
                }}>
                  {plan.name}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, margin: "20px 0 24px" }}>
                <span style={{
                  fontSize: plan.price === "Custom" ? 32 : 44, fontWeight: 900,
                  color: "var(--text-primary)", fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.03em", lineHeight: 1,
                }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 6 }}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* CTA button */}
              <button
                id={`pricing-cta-${plan.id}`}
                className={plan.popular ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", justifyContent: "center", marginBottom: 28, padding: "13px 20px" }}
                onClick={() => {}}
              >
                {plan.cta}
              </button>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border)", marginBottom: 20 }} />

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle
                      size={14}
                      color={plan.popular ? "var(--accent)" : "var(--success)"}
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
