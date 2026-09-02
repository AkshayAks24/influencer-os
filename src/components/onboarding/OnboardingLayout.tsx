import { motion, AnimatePresence } from "framer-motion";
import type { OnboardingStep } from "@/types/onboarding";

interface OnboardingLayoutProps {
  step: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  heading: string;
  description?: string;
  onBack?: () => void;
  showProgress?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const stepVariants = {
  enter: { opacity: 0, x: 60, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -60, filter: "blur(4px)" },
};

export function OnboardingLayout({
  step,
  stepIndex,
  totalSteps,
  heading,
  description,
  onBack,
  showProgress = true,
  children,
  footer,
}: OnboardingLayoutProps) {
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="pulse-theme min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-pulse-bg/80 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          {/* Back button */}
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-heading font-semibold text-pulse-muted hover:text-pulse-text transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-pulse-text flex items-center justify-center">
                <span className="text-pulse-white text-xs font-bold font-heading">P</span>
              </div>
              <span className="font-heading font-bold text-pulse-text text-sm">Creator Pulse</span>
            </div>
          )}

          {/* Step counter */}
          {showProgress && (
            <span className="text-xs font-heading font-semibold text-pulse-muted">
              {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="h-1 bg-pulse-elevated">
            <motion.div
              className="h-full bg-pulse-lime rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        )}
      </header>

      {/* Content area */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-lg mx-auto w-full px-5 pt-8 pb-6 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 flex flex-col"
            >
              {/* Heading */}
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-pulse-text leading-tight">
                {heading}
              </h1>

              {description && (
                <p className="mt-2 text-base font-body text-pulse-muted leading-relaxed">
                  {description}
                </p>
              )}

              {/* Step content */}
              <div className="mt-6 flex-1">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / CTA area */}
      {footer && (
        <div className="sticky bottom-0 bg-pulse-bg/80 backdrop-blur-xl border-t border-pulse-border">
          <div className="max-w-lg mx-auto px-5 py-4">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
