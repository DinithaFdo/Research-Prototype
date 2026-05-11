"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, LogIn, HelpCircle, Mail, ChevronDown, LayoutDashboard } from "lucide-react";

type Tab = "text" | "voice" | "demo" | "dashboard";

const NAV_LINKS = [
  { id: "text"  as Tab, label: "Text Detection",  path: "/?tab=text"  },
  { id: "voice" as Tab, label: "Voice Detection", path: "/?tab=voice" },
];

const SECTION_LINKS = [
  { href: "#pricing", label: "Pricing" },
  { href: "#about",   label: "About"   },
];

const DROPDOWN_ITEMS = [
  { id: "login",   label: "Login / Sign Up", Icon: LogIn      },
  { id: "contact", label: "Contact Us",      Icon: Mail       },
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
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
        style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 58, padding: "0 18px", borderRadius: 12,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--border)",
          pointerEvents: "auto",
        }}
      >
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => onTab(null)}
          style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={15} color="#fff" />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-heading)" }}>VeriGuard AI</div>
            <div style={{ fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1.5, fontFamily: "var(--font-body)" }}>Detection Platform</div>
          </div>
        </button>

        {/* Center nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {NAV_LINKS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                id={`nav-tab-${id}`}
                onClick={() => onTab(id)}
                style={{
                  position: "relative", display: "flex", alignItems: "center",
                  padding: "6px 14px", borderRadius: 8, fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: "transparent", border: "none", cursor: "pointer",
                  transition: "color 0.15s", fontFamily: "var(--font-body)", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
              >
                {isActive && (
                  <motion.div layoutId="nav-pill" style={{ position: "absolute", inset: 0, borderRadius: 8, background: "var(--accent-light)", border: "1px solid var(--border-accent)" }} />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
              </button>
            );
          })}
          <div style={{ width: 1, height: 14, background: "var(--border)", margin: "0 4px" }} />
          {SECTION_LINKS.map(({ href, label }) => (
            <a
              key={href} href={href} id={`nav-link-${href.replace("#", "")}`}
              style={{ display: "flex", alignItems: "center", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.15s", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side: Dashboard button + User dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Dashboard button */}
          <button
            id="nav-tab-dashboard"
            onClick={() => onTab("dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 13px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              color: active === "dashboard" ? "var(--accent)" : "var(--text-secondary)",
              background: active === "dashboard" ? "var(--accent-light)" : "transparent",
              border: `1px solid ${active === "dashboard" ? "var(--border-accent)" : "var(--border)"}`,
              cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-body)", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              if (active !== "dashboard") {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-accent)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)";
              }
            }}
            onMouseLeave={e => {
              if (active !== "dashboard") {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            <LayoutDashboard size={13} />
            Dashboard
          </button>

          {/* User dropdown */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <button
              id="nav-user-btn" aria-label="User menu" aria-expanded={dropOpen} aria-haspopup="true"
              onClick={() => setDropOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px 6px 8px", borderRadius: 8,
                background: dropOpen ? "var(--accent-light)" : "transparent",
                border: `1px solid ${dropOpen ? "var(--border-accent)" : "var(--border)"}`,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-body)",
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={12} color="var(--accent)" />
              </div>
              <ChevronDown size={10} color="var(--text-muted)"
                style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              />
            </button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  id="nav-user-dropdown" role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] as any }}
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    minWidth: 190, background: "#fff",
                    border: "1px solid var(--border)", borderRadius: 10,
                    overflow: "hidden", padding: 5,
                  }}
                >
                  {DROPDOWN_ITEMS.map(({ id, label, Icon }) => (
                    <button
                      key={id} id={`dropdown-${id}`} role="menuitem"
                      onClick={() => {
                        setDropOpen(false);
                        if (id === "login")   onLoginClick();
                        if (id === "contact") onContactClick();
                        if (id === "help")    onHelpClick();
                      }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 9,
                        padding: "9px 11px", borderRadius: 7, fontSize: 13, fontWeight: 500,
                        color: "var(--text-primary)", background: "transparent", border: "none",
                        cursor: "pointer", transition: "background 0.12s, color 0.12s",
                        fontFamily: "var(--font-body)", textAlign: "left",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    >
                      <Icon size={13} color="var(--accent)" />{label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
