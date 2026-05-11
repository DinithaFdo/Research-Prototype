"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "For individuals and students exploring AI detection.",
    cta: "Start Free",
    ctaStyle: "secondary" as const,
    popular: false,
    features: [
      "50 text checks / month",
      "10 voice uploads / month",
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
    description: "For researchers and creators who need deeper insights.",
    cta: "Get Pro",
    ctaStyle: "primary" as const,
    popular: true,
    features: [
      "500 text checks / month",
      "100 voice uploads / month",
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
    description: "For institutions and teams needing secure, scalable detection.",
    cta: "Contact Sales",
    ctaStyle: "secondary" as const,
    popular: false,
    features: [
      "High-volume detection",
      "Team access and admin controls",
      "Advanced explainability reports",
      "Full API access",
      "Secure data handling",
      "Dedicated support",
    ],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
});

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: "96px 0 80px", background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
      <div className="page-container">
        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 14 }}>Pricing</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 12 }}>
            Simple, transparent{" "}
            <span style={{ color: "var(--accent)" }}>pricing</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Start free and scale as your needs grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20, alignItems: "stretch" }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              id={`pricing-card-${plan.id}`}
              {...fadeUp(i * 0.08)}
              style={{
                position: "relative",
                background: "var(--bg-card)",
                border: plan.popular ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 14, padding: "28px 24px",
                display: "flex", flexDirection: "column",
                transition: "border-color 0.2s",
              }}
            >
              {/* Popular indicator */}
              {plan.popular && (
                <div style={{ position: "absolute", top: -1, left: 24, right: 24, height: 2, background: "var(--accent)", borderRadius: "0 0 3px 3px" }} />
              )}
              {plan.popular && (
                <div style={{
                  position: "absolute", top: 14, right: 18,
                  padding: "3px 10px", borderRadius: 6,
                  background: "var(--accent)", color: "#fff",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
                  fontFamily: "var(--font-body)",
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div style={{ marginBottom: 6, paddingTop: plan.popular ? 2 : 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: plan.popular ? "var(--accent)" : "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 5 }}>
                  {plan.name}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{plan.description}</p>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, margin: "18px 0 22px" }}>
                <span style={{ fontSize: plan.price === "Custom" ? 30 : 40, fontWeight: 900, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 5 }}>{plan.period}</span>
                )}
              </div>

              {/* CTA */}
              <button
                id={`pricing-cta-${plan.id}`}
                className={plan.popular ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", justifyContent: "center", marginBottom: 24, padding: "11px 18px" }}
                onClick={() => {}}
              >
                {plan.cta}
              </button>

              <div style={{ borderTop: "1px solid var(--border)", marginBottom: 18 }} />

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                    <CheckCircle size={13} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f}</span>
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
