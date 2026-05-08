"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, MessageSquare, Send, CheckCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; setSent(false); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    /* CONTACT PLACEHOLDER — wire to your email/API endpoint here */
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid var(--border)", fontSize: 13,
    color: "var(--text-primary)", background: "var(--bg-surface)",
    fontFamily: "var(--font-body)", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="contact-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,26,46,0.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          />
          <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>
            <motion.div
              id="contact-modal"
              role="dialog" aria-modal="true" aria-labelledby="contact-modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as any }}
              style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.12)", padding: "36px 32px 28px", position: "relative", pointerEvents: "auto" }}
            >
              {/* Close */}
              <button
                onClick={onClose} aria-label="Close"
                style={{ position: "absolute", top: 18, right: 18, width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)"; }}
              >
                <X size={14} color="var(--text-secondary)" />
              </button>

              {!sent ? (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <h2 id="contact-modal-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-heading)", marginBottom: 6 }}>
                      Contact Us
                    </h2>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                      Have a question, found an issue, or want to request a feature? We'd love to hear from you.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>NAME</label>
                        <div style={{ position: "relative" }}>
                          <User size={12} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                          <input
                            id="contact-name" type="text" required placeholder="Your name"
                            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            style={{ ...inputStyle, paddingLeft: 32 }}
                            onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)"; }}
                            onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)"; }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>EMAIL</label>
                        <div style={{ position: "relative" }}>
                          <Mail size={12} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                          <input
                            id="contact-email" type="email" required placeholder="you@example.com"
                            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            style={{ ...inputStyle, paddingLeft: 32 }}
                            onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)"; }}
                            onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)"; }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>SUBJECT</label>
                      <input
                        id="contact-subject" type="text" required placeholder="What is this about?"
                        value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)"; }}
                        onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)"; }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>MESSAGE</label>
                      <div style={{ position: "relative" }}>
                        <MessageSquare size={12} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: 13, pointerEvents: "none" }} />
                        <textarea
                          id="contact-message" required rows={4} placeholder="Tell us more..."
                          value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          style={{ ...inputStyle, paddingLeft: 32, resize: "vertical" }}
                          onFocus={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--accent)"; }}
                          onBlur={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
                        />
                      </div>
                    </div>

                    <button
                      id="contact-submit" type="submit"
                      className="btn-primary" disabled={sending}
                      style={{ width: "100%", justifyContent: "center", padding: "13px 20px", marginTop: 4 }}
                    >
                      {sending ? "Sending..." : <><Send size={14} /> Send Message</>}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F0FDF4", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <CheckCircle size={26} color="#22C55E" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: 24 }}>
                    Thanks for reaching out. We'll get back to you within 1–2 business days.
                  </p>
                  <button className="btn-secondary" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Close</button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
