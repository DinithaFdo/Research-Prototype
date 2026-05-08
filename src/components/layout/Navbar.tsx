"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, LogIn, HelpCircle, Mail, ChevronDown } from "lucide-react";

type Tab = "text" | "voice" | "demo";

const NAV_LINKS = [
  { id: "text" as Tab,  label: "Text Detection",  path: "/?tab=text" },
  { id: "voice" as Tab, label: "Voice Detection",  path: "/?tab=voice" },
];
const SECTION_LINKS = [
  { href: "#pricing", label: "Pricing" },
  { href: "#about",   label: "About" },
];
const DROPDOWN_ITEMS = [
  { id: "login",   label: "Login / Sign Up", Icon: LogIn },
  { id: "contact", label: "Contact Us",      Icon: Mail },
  { id: "help",    label: "Help Center",     Icon: HelpCircle },
];

interface NavbarProps {
  active: Tab | null;
  onTab: (t: Tab | null) => void;
  onLoginClick: () => void;
  onContactClick: () => void;
  onHelpClick: () => void;
}

export function Navbar({ active, onTab, onLoginClick, onContactClick, onHelpClick }: NavbarProps) {
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setDropOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "12px 20px", pointerEvents: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
        style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60, padding: "0 20px", borderRadius: 999,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(140,82,255,0.15)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          pointerEvents: "auto",
        }}
      >
        {/* Logo — click navigates to home */}
        <button
          id="nav-logo-btn"
          onClick={() => onTab(null)}
          style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {/* LOGO PLACEHOLDER — replace div below with:
              <img src="/logo.png" alt="VeriGuard AI" style={{ height: 32 }} /> */}
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Shield size={17} color="#fff" />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--accent)", letterSpacing: "-0.02em", fontFamily: "var(--font-heading)" }}>VeriGuard AI</div>
            <div style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2, fontFamily: "var(--font-body)" }}>AI Detection Platform</div>
          </div>
        </button>

        {/* Center nav — no icons, shows URL path context */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {NAV_LINKS.map(({ id, label, path }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                id={`nav-tab-${id}`}
                onClick={() => onTab(id)}
                title={path}
                style={{
                  position: "relative", display: "flex", alignItems: "center",
                  padding: "7px 16px", borderRadius: 999, fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: "transparent", border: "none", cursor: "pointer",
                  transition: "color 0.2s", fontFamily: "var(--font-body)", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
              >
                {isActive && (
                  <motion.div layoutId="nav-pill" style={{ position: "absolute", inset: 0, borderRadius: 999, background: "var(--accent-light)", border: "1px solid var(--border-accent)" }} />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
              </button>
            );
          })}
          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 4px" }} />
          {SECTION_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              id={`nav-link-${href.replace("#", "")}`}
              style={{
                display: "flex", alignItems: "center",
                padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                color: "var(--text-secondary)", textDecoration: "none",
                transition: "color 0.2s", fontFamily: "var(--font-body)", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* User dropdown */}
        <div ref={dropRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            id="nav-user-btn" aria-label="User menu" aria-expanded={dropOpen} aria-haspopup="true"
            onClick={() => setDropOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px 7px 10px", borderRadius: 999,
              background: dropOpen ? "var(--accent-light)" : "var(--bg-surface)",
              border: `1px solid ${dropOpen ? "var(--border-accent)" : "var(--border)"}`,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-body)",
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--accent-light)", border: "1.5px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={13} color="var(--accent)" />
            </div>
            <ChevronDown size={11} color="var(--text-secondary)"
              style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            />
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div
                id="nav-user-dropdown" role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as any }}
                style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  minWidth: 200, background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid var(--border)", borderRadius: 16,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
                  overflow: "hidden", padding: 6,
                }}
              >
                {DROPDOWN_ITEMS.map(({ id, label, Icon }) => (
                  <button
                    key={id} id={`dropdown-${id}`} role="menuitem"
                    onClick={() => {
                      setDropOpen(false);
                      if (id === "login") onLoginClick();
                      if (id === "contact") onContactClick();
                      if (id === "help") onHelpClick();
                    }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                      color: "var(--text-primary)", background: "transparent", border: "none",
                      cursor: "pointer", transition: "background 0.15s,color 0.15s",
                      fontFamily: "var(--font-body)", textAlign: "left",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                  >
                    <Icon size={14} color="var(--accent)" />{label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  );
}
