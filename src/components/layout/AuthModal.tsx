"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, GitBranch, Building2, Mail, ArrowRight, Shield } from "lucide-react";

import GoogleIcon from "@/assets/google-color-svgrepo-com.svg";
import MicrosoftIcon from "@/assets/microsoft-svgrepo-com.svg";
import GithubIcon from "@/assets/github-svgrepo-com.svg";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SSO_BUTTONS = [
  { id: "sso-google",    label: "Continue with Google",    iconSrc: GoogleIcon,       bg: "#fff",     border: "1.5px solid #E2E8F0", color: "#1A1A2E", hoverBg: "#F8FAFC" },
  { id: "sso-microsoft", label: "Continue with Microsoft", iconSrc: MicrosoftIcon,   bg: "#fff",     border: "1.5px solid #E2E8F0", color: "#1A1A2E", hoverBg: "#F8FAFC" },
  { id: "sso-github",    label: "Continue with GitHub",    iconSrc: GithubIcon,   bg: "#1A1A2E",  border: "1.5px solid #1A1A2E", color: "#fff",    hoverBg: "#2D2D4A" },
];

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="auth-modal-backdrop"
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(26,26,46,0.5)",
              backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Centering flex wrapper — avoids transform conflict with framer-motion */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 201,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "16px",
              pointerEvents: "none",
            }}
          >
            <motion.div
              id="auth-modal"
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as any }}
              style={{
                width: "100%", maxWidth: 420,
                background: "#FFFFFF",
                borderRadius: 24,
                border: "1px solid var(--border)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
                padding: "36px 32px 28px",
                overflow: "hidden",
                position: "relative",
                pointerEvents: "auto",
              }}
            >
              
              {/* Close button */}
              <button
                id="auth-modal-close"
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: "absolute", top: 18, right: 18,
                  width: 30, height: 30, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)"; }}
              >
                <X size={14} color="var(--text-secondary)" />
              </button>

              {/* Logo mark */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 20px rgba(140,82,255,0.25)",
                }}>
                  <Shield size={22} color="#fff" />
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h2 id="auth-modal-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-heading)", marginBottom: 6 }}>
                  Welcome back
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                  Sign in to continue using the detection platform.
                </p>
              </div>

              {/* SSO buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {SSO_BUTTONS.map(({ id, label, iconSrc, bg, border, color, hoverBg }) => (
                  <button key={id} id={id}
                    onClick={() => {/* SSO PLACEHOLDER — wire real OAuth handler here */}}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "13px 20px", borderRadius: 12, background: bg, border, color, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.15s", fontFamily: "var(--font-body)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = bg; }}
                  >
                    <Image src={iconSrc} alt={label} width={18} height={18} />{label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* Email field */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Mail size={14} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    id="auth-email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: 12, border: "1.5px solid var(--border)", fontSize: 13, color: "var(--text-primary)", background: "var(--bg-surface)", fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                    onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)"; }}
                    onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)"; }}
                  />
                </div>
                <button id="auth-email-continue" onClick={() => {}} className="btn-primary" style={{ padding: "12px 16px", borderRadius: 12, gap: 6, flexShrink: 0 }}>
                  Continue <ArrowRight size={13} />
                </button>
              </div>

              {/* Footer link */}
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                New here?{" "}
                <button id="auth-create-account" onClick={() => {}}
                  style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", padding: 0 }}>
                  Create an account
                </button>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
