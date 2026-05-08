"use client";

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Text Detection",  href: "#" },
      { label: "Voice Detection", href: "#" },
      { label: "Pricing",         href: "#pricing" },
      { label: "About",           href: "#about" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center",   href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Contact Us",    href: "#" },
      { label: "FAQs",          href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security",         href: "#" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "API Access",    href: "#" },
      { label: "Enterprise",    href: "#" },
      { label: "System Status", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="about" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-page)" }}>
      {/* Main columns */}
      <div className="page-container" style={{ padding: "64px 40px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(3, 1fr)", gap: "40px 32px" }}>

          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {/* Shield icon inline as SVG to avoid icon import */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--accent)", letterSpacing: "-0.01em", fontFamily: "var(--font-heading)" }}>VeriGuard AI</div>
                <div style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>AI Detection Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, fontFamily: "var(--font-body)", maxWidth: 240 }}>
              Enterprise-grade AI detection for text authenticity and synthetic voice analysis. Fast, explainable, and built for scale.
            </p>
          </div>

          {/* Link columns — no icons */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: 16, fontFamily: "var(--font-heading)" }}>
                {col.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(({ label, href }) => (
                  <a
                    key={label} href={href}
                    style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", fontFamily: "var(--font-body)", transition: "color 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="page-container" style={{ padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            © 2026 VeriGuard AI. All rights reserved.
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Built for responsible AI content verification.
          </span>
        </div>
      </div>
    </footer>
  );
}
