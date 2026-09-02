import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const steps = [
  { emoji: "👀", text: "Checking what's trending" },
  { emoji: "🧠", text: "Matching your creator profile" },
  { emoji: "🎯", text: "Finding your opportunities" },
  { emoji: "✨", text: "Preparing your ideas" },
];

export function PulseLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      <motion.h2
        className="text-2xl sm:text-3xl font-heading font-bold text-pulse-text mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Scanning your world...
      </motion.h2>

      <div className="space-y-4 w-full max-w-xs">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;

          return (
            <motion.div
              key={i}
              className={`flex items-center gap-3 rounded-xl px-5 py-3.5 transition-colors duration-300 ${
                isActive
                  ? "bg-pulse-card border border-pulse-border shadow-pulse-card"
                  : isDone
                  ? "bg-transparent"
                  : "bg-transparent"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: i <= activeStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <span className="text-xl">{isDone ? "✅" : step.emoji}</span>
              <span
                className={`text-sm font-body font-medium ${
                  isActive
                    ? "text-pulse-text"
                    : isDone
                    ? "text-pulse-muted"
                    : "text-pulse-muted/50"
                }`}
              >
                {step.text}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-pulse-lime"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
