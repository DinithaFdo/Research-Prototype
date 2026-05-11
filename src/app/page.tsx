"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { HowItWorksSection, DetectionShowcaseSection, FinalCTASection } from "@/components/layout/LandingSections";
import { AuthModal } from "@/components/layout/AuthModal";
import { ContactModal } from "@/components/layout/ContactModal";
import { HelpCenterModal } from "@/components/layout/HelpCenterModal";
import { PricingSection } from "@/components/layout/PricingSection";
import { AboutSection } from "@/components/layout/AboutSection";
import { Footer } from "@/components/layout/Footer";
import { TextForensicsDashboard } from "@/components/text/TextForensicsDashboard";
import { VoiceForensicsDashboard } from "@/components/voice/VoiceForensicsDashboard";
import { InteractiveDemoPage } from "@/components/demo/InteractiveDemoPage";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

type Tab = "text" | "voice" | "demo" | "dashboard";

const PAGE = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
} as unknown as import("framer-motion").Variants;

export default function HomePage() {
  const [tab,         setTab]         = useState<Tab | null>(null);
  const [authOpen,    setAuthOpen]    = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [helpOpen,    setHelpOpen]    = useState(false);

  /* Read initial tab from URL */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab") as Tab | null;
    if (t === "text" || t === "voice" || t === "demo" || t === "dashboard") setTab(t);
  }, []);

  /* Sync URL when tab changes */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = tab ? `/?tab=${tab}` : "/";
    window.history.pushState({ tab }, "", url);
  }, [tab]);

  /* Handle browser back/forward */
  useEffect(() => {
    const h = (e: PopStateEvent) => {
      const t = (e.state as { tab?: Tab } | null)?.tab ?? null;
      setTab(t);
    };
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);

  const navigate = (t: Tab | null) => setTab(t);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <Navbar
        active={tab}
        onTab={navigate}
        onLoginClick={() => setAuthOpen(true)}
        onContactClick={() => setContactOpen(true)}
        onHelpClick={() => setHelpOpen(true)}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <HelpCenterModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <main style={{ flex: 1, paddingTop: 84 }}>
        <AnimatePresence mode="wait">
          {!tab ? (
            /* ── Landing page ── */
            <motion.div key="home" variants={PAGE} initial="initial" animate="animate" exit="exit">
              <HeroSection
                onTextStart={() => navigate("text")}
                onVoiceStart={() => navigate("voice")}
                onDemoStart={() => navigate("demo")}
              />
              <HowItWorksSection />
              <DetectionShowcaseSection
                onTextStart={() => navigate("text")}
                onVoiceStart={() => navigate("voice")}
              />
              <PricingSection />
              <AboutSection />
              <FinalCTASection onStart={() => navigate("text")} />
              <Footer />
            </motion.div>
          ) : (
            /* ── Tool pages ── */
            <motion.div key={tab} variants={PAGE} initial="initial" animate="animate" exit="exit">
              <div className="page-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
                {tab === "text"      && <TextForensicsDashboard />}
                {tab === "voice"     && <VoiceForensicsDashboard />}
                {tab === "demo"      && <InteractiveDemoPage />}
                {tab === "dashboard" && (
                  <DashboardPage
                    onTextStart={() => navigate("text")}
                    onVoiceStart={() => navigate("voice")}
                  />
                )}
              </div>

              <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 0", background: "var(--bg-page)" }}>
                <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    © 2026 VeriGuard AI — AI Detection Platform
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    Built for responsible AI content verification.
                  </span>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
