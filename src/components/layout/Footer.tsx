"use client";
import { Shield, FileText, Mic, DollarSign, Info, HelpCircle, BookOpen, Mail, MessageCircle, Lock, FileCheck, ShieldCheck, Cpu, Building2, Activity } from "lucide-react";

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Text Detection",  href: "#", Icon: FileText },
      { label: "Voice Detection", href: "#", Icon: Mic },
      { label: "Pricing",         href: "#pricing", Icon: DollarSign },
      { label: "About",           href: "#about",   Icon: Info },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center",     href: "#", Icon: HelpCircle },
      { label: "Documentation",   href: "#", Icon: BookOpen },
      { label: "Contact Us",      href: "#", Icon: Mail },
      { label: "FAQs",            href: "#", Icon: MessageCircle },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "#", Icon: Lock },
      { label: "Terms of Service", href: "#", Icon: FileCheck },
      { label: "Security",         href: "#", Icon: ShieldCheck },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "API Access",     href: "#", Icon: Cpu },
      { label: "Enterprise",     href: "#", Icon: Building2 },
      { label: "System Status",  href: "#", Icon: Activity },
    ],
  },
];

export function Footer() {
  return (
    <footer
      id="about"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-page)",
      }}
    >
      {/* Main columns */}
      <div className="page-container" style={{ padding: "64px 40px 48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.6fr repeat(3, 1fr)",
          gap: "40px 32px",
        }}>
          {/* Brand column */}
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg,#8C52FF 0%,#C084FC 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(140,82,255,0.25)", flexShrink: 0,
              }}>
                <Shield size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--accent)", letterSpacing: "-0.01em", fontFamily: "var(--font-heading)" }}>VeriGuard AI</div>
                <div style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>AI Detection Platform</div>
              </div>
            </div>
            <p style={{
              fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75,
              fontFamily: "var(--font-body)", maxWidth: 240,
            }}>
              Enterprise-grade AI detection for text authenticity and synthetic voice analysis. Fast, explainable, and built for scale.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--text-primary)",
                marginBottom: 16, fontFamily: "var(--font-heading)",
              }}>
                {col.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(({ label, href, Icon }) => (
                  <a
                    key={label} href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      fontSize: 13, color: "var(--text-secondary)",
                      textDecoration: "none", fontFamily: "var(--font-body)",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                  >
                    <Icon size={12} color="var(--text-muted)" />
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
        <div className="page-container" style={{
          padding: "18px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
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
