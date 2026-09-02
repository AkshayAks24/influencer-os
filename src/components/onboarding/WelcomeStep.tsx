import { motion } from "framer-motion";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="pulse-theme min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/3 -left-40 w-80 h-80 bg-pulse-lime/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-pulse-purple/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-pulse-text flex items-center justify-center mx-auto shadow-lg">
          <span className="text-pulse-white text-2xl font-bold font-heading">P</span>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pulse-text leading-[1.1] tracking-tight"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        Let's understand
        <br />
        your content.
      </motion.h1>

      {/* Description */}
      <motion.p
        className="mt-5 text-base sm:text-lg font-body text-pulse-muted max-w-md leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        We'll analyze your content, audience and goals to find opportunities
        relevant to you.
      </motion.p>

      {/* CTA */}
      <motion.button
        className="mt-10 px-8 py-4 rounded-full bg-pulse-text text-pulse-white font-heading font-bold text-base hover:bg-pulse-text/90 transition-colors shadow-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
      >
        Get Started →
      </motion.button>

      {/* Trust line */}
      <motion.p
        className="mt-6 text-xs font-body text-pulse-muted/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Takes less than 2 minutes
      </motion.p>
    </div>
  );
}
