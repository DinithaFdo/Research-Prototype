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
      <div className="page-container" style={{ padding: "60px 40px 44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", gap: "36px 28px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text-primary)", letterSpacing: "-0.01em", fontFamily: "var(--font-heading)" }}>VeriGuard AI</div>
                <div style={{ fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>Detection Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 220 }}>
              AI content detection with clear explanations — for text and voice.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: 14, fontFamily: "var(--font-heading)" }}>
                {col.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {col.links.map(({ label, href }) => (
                  <a
                    key={label} href={href}
                    style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.12s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
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
        <div className="page-container" style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>© 2026 VeriGuard AI. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Built for responsible AI content verification.</span>
        </div>
      </div>
    </footer>
  );
}
