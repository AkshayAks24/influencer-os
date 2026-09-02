import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import landingData from "@/data/pulse-landing.json";

/* ──────────────────────────── Color map ──────────────────────────── */
const accentMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  lime:   { bg: "bg-pulse-lime/15", border: "border-pulse-lime/40", text: "text-pulse-lime",   glow: "shadow-[0_0_40px_rgba(199,255,61,0.15)]" },
  pink:   { bg: "bg-pulse-pink/15", border: "border-pulse-pink/40", text: "text-pulse-pink",   glow: "shadow-[0_0_40px_rgba(255,79,163,0.15)]" },
  purple: { bg: "bg-pulse-purple/15", border: "border-pulse-purple/40", text: "text-pulse-purple", glow: "shadow-[0_0_40px_rgba(139,92,246,0.15)]" },
  orange: { bg: "bg-pulse-orange/15", border: "border-pulse-orange/40", text: "text-pulse-orange", glow: "shadow-[0_0_40px_rgba(255,107,53,0.15)]" },
  blue:   { bg: "bg-pulse-blue/15", border: "border-pulse-blue/40", text: "text-pulse-blue",   glow: "shadow-[0_0_40px_rgba(91,124,255,0.15)]" },
};

/* ──────────────────────────── Fade-in wrapper ────────────────────── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const navigate = useNavigate();
  const { hero, positioning } = landingData;
  const lines = hero.headline.split("\n");

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pulse-lime/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pulse-pink/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pulse-purple/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 rounded-full bg-pulse-card border border-pulse-border px-4 py-2 mb-8 shadow-pulse-card"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-sm font-body font-medium text-pulse-muted">{hero.badge}</span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {lines.map((line, i) => (
          <motion.h1
            key={i}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-pulse-text leading-[1.05] tracking-tight"
            variants={{
              hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
          >
            {line}
          </motion.h1>
        ))}
      </motion.div>

      {/* Subtext */}
      <motion.p
        className="mt-6 text-lg sm:text-xl text-pulse-muted font-body max-w-xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {hero.subtext}
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <motion.button
          className="relative px-8 py-4 rounded-full bg-pulse-text text-pulse-white font-heading font-bold text-base hover:bg-pulse-text/90 transition-colors shadow-lg"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/onboarding")}
        >
          {hero.cta}
          <span className="absolute inset-0 rounded-full bg-pulse-lime/20 blur-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>

        <motion.a
          href="#how-it-works"
          className="px-6 py-4 rounded-full border border-pulse-border text-pulse-text font-heading font-semibold text-base hover:bg-pulse-elevated transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {hero.secondaryCta} ↓
        </motion.a>
      </motion.div>

      {/* Positioning tagline */}
      <motion.p
        className="mt-16 text-sm font-body text-pulse-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {positioning.tagline}{" "}
        <span className="font-semibold text-pulse-text">{positioning.highlight}</span>
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-pulse-border flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-pulse-muted"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PROCESS SECTION — Discover → Match → Create → Grow
   ════════════════════════════════════════════════════════════════════ */
function ProcessSection() {
  const { process } = landingData;
  const lines = process.headline.split("\n");

  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <FadeIn className="text-center mb-16 sm:mb-20">
          {lines.map((line, i) => (
            <h2 key={i} className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pulse-text leading-[1.1] tracking-tight">
              {line}
            </h2>
          ))}
          <p className="mt-4 text-lg text-pulse-muted font-body">{process.subtext}</p>
        </FadeIn>

        {/* Steps */}
        <div className="space-y-6 sm:space-y-8">
          {process.steps.map((step, i) => {
            const accent = accentMap[step.color] || accentMap.lime;
            return (
              <FadeIn key={step.number} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl border ${accent.border} ${accent.bg} p-6 sm:p-8 transition-shadow duration-300 hover:${accent.glow}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    {/* Number + emoji */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:min-w-[72px]">
                      <span className="text-3xl sm:text-4xl">{step.emoji}</span>
                      <span className={`text-xs font-heading font-bold tracking-widest ${accent.text} opacity-60`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-pulse-text leading-tight">
                        {step.title}
                      </h3>
                      <p className={`text-base font-body font-medium ${accent.text} mt-1`}>
                        {step.subtitle}
                      </p>
                      <p className="mt-3 text-base font-body text-pulse-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector line (except last) */}
                  {i < process.steps.length - 1 && (
                    <div className="hidden sm:block absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-6 bg-pulse-border" />
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FEATURES SECTION
   ════════════════════════════════════════════════════════════════════ */
function FeaturesSection() {
  const { features } = landingData;
  const lines = features.headline.split("\n");

  return (
    <section className="py-24 sm:py-32 px-6 bg-pulse-card">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <FadeIn className="text-center mb-16">
          {lines.map((line, i) => (
            <h2 key={i} className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pulse-text leading-[1.1] tracking-tight">
              {line}
            </h2>
          ))}
          <p className="mt-4 text-lg text-pulse-muted font-body max-w-2xl mx-auto leading-relaxed">
            {features.subtext}
          </p>
        </FadeIn>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div
                className="rounded-2xl border border-pulse-border bg-pulse-bg p-6 h-full transition-shadow duration-300"
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              >
                <span className="text-3xl mb-4 block">{item.emoji}</span>
                <h3 className="font-heading text-lg font-bold text-pulse-text mb-2">
                  {item.title}
                </h3>
                <p className="text-sm font-body text-pulse-muted leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SOCIAL PROOF / STATS SECTION
   ════════════════════════════════════════════════════════════════════ */
function SocialSection() {
  const { social } = landingData;
  const lines = social.headline.split("\n");

  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          {lines.map((line, i) => (
            <h2 key={i} className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pulse-text leading-[1.1] tracking-tight">
              {line}
            </h2>
          ))}
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {social.stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className="text-center">
                <p className="font-heading text-4xl sm:text-5xl font-bold text-pulse-text">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-body text-pulse-muted">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FINAL CTA SECTION
   ════════════════════════════════════════════════════════════════════ */
function CTASection() {
  const navigate = useNavigate();
  const { cta } = landingData;
  const lines = cta.headline.split("\n");

  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <div className="rounded-3xl bg-pulse-text p-10 sm:p-16 relative overflow-hidden">
            {/* Gradient orbs inside dark card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pulse-lime/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pulse-purple/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              {lines.map((line, i) => (
                <h2 key={i} className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pulse-white leading-[1.1] tracking-tight">
                  {line}
                </h2>
              ))}

              <p className="mt-5 text-base sm:text-lg font-body text-white/60 max-w-md mx-auto">
                {cta.subtext}
              </p>

              <motion.button
                className="mt-8 px-8 py-4 rounded-full bg-pulse-lime text-pulse-text font-heading font-bold text-base hover:bg-pulse-lime/90 transition-colors"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/onboarding")}
              >
                {cta.button} →
              </motion.button>

              <p className="mt-4 text-xs font-body text-white/40">
                {cta.note}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════════ */
function LandingFooter() {
  const { footer } = landingData;

  return (
    <footer className="border-t border-pulse-border py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pulse-text flex items-center justify-center">
            <span className="text-pulse-white text-sm font-bold font-heading">P</span>
          </div>
          <div>
            <span className="font-heading font-bold text-pulse-text text-sm">{footer.brand}</span>
            <span className="text-pulse-muted text-xs font-body ml-2">{footer.tagline}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {footer.links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-body text-pulse-muted hover:text-pulse-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs font-body text-pulse-muted">
          © {new Date().getFullYear()} Creator Pulse
        </p>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE EXPORT
   ════════════════════════════════════════════════════════════════════ */
export function PulseLanding() {
  return (
    <div className="pulse-theme min-h-screen">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-pulse-bg/80 backdrop-blur-xl border-b border-pulse-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pulse-text flex items-center justify-center">
              <span className="text-pulse-white text-sm font-bold font-heading">P</span>
            </div>
            <span className="font-heading font-bold text-pulse-text text-base hidden sm:inline">
              Creator Pulse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-heading font-semibold text-pulse-text hover:text-pulse-muted transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              to="/onboarding"
              className="text-sm font-heading font-bold text-pulse-white bg-pulse-text px-5 py-2 rounded-full hover:bg-pulse-text/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Page sections */}
      <HeroSection />
      <ProcessSection />
      <FeaturesSection />
      <SocialSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
