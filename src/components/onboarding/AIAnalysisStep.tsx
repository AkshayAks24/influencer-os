import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import onboardingData from "@/data/onboarding.json";

interface AIAnalysisStepProps {
  onNext: () => void;
  onUpdateInsights: (insights: { bestContent: string; style: string; avoid: string }) => void;
}

export function AIAnalysisStep({ onNext, onUpdateInsights }: AIAnalysisStepProps) {
  const steps = onboardingData.analysisSteps;
  const [activeIndex, setActiveIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (activeIndex < steps.length) {
      const timer = setTimeout(() => setActiveIndex((p) => p + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // Simulate backend generating insights
        onUpdateInsights({
          bestContent: "Python tutorials & Workflow automations",
          style: "Educational · Practical · Fast-paced",
          avoid: "Long talking-head intros, vague generalizations",
        });
        setDone(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, steps.length, onUpdateInsights]);

  if (done) {
    return (
      <div className="pulse-theme min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
          <span className="text-6xl block mb-6">🎉</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-pulse-text mb-3">Your Creator Profile is ready.</h2>
          <p className="text-base font-body text-pulse-muted mb-10">We've analyzed your content and built your personalized profile.</p>
          <motion.button
            className="px-8 py-4 rounded-full bg-pulse-text text-pulse-white font-heading font-bold text-base shadow-lg"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
          >
            See my Creator DNA →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pulse-theme min-h-screen flex flex-col items-center justify-center px-6">
      <motion.h2 className="text-2xl sm:text-3xl font-heading font-bold text-pulse-text mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        Analyzing your content
      </motion.h2>
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((step, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <motion.div
              key={step.id}
              className={`flex items-center gap-3 rounded-xl px-5 py-3.5 transition-colors ${isActive ? "bg-pulse-card border border-pulse-border shadow-pulse-card" : "bg-transparent"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: i <= activeIndex ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="text-xl">{isDone ? "✅" : isActive ? "⏳" : "○"}</span>
              <span className={`text-sm font-body font-medium ${isActive ? "text-pulse-text" : isDone ? "text-pulse-muted" : "text-pulse-muted/50"}`}>
                {step.label}
              </span>
              {isActive && (
                <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-pulse-lime" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
