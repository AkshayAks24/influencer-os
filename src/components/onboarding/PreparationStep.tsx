import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";

interface PreparationStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export function PreparationStep({ onComplete, onBack }: PreparationStepProps) {
  const [notificationValue, setNotificationValue] = useState("");
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    if (notificationValue.trim()) {
      setNotified(true);
    }
  };

  return (
    <OnboardingLayout
      step="preparation"
      stepIndex={7}
      totalSteps={8}
      heading="Your first Trend Intelligence report is being prepared."
      description="We're analyzing current trends relevant to your niche and matching them with your creator profile."
      onBack={onBack}
      footer={
        <motion.button
          className="w-full py-3.5 rounded-full font-heading font-bold text-base transition-all bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg"
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
        >
          Go to Dashboard
        </motion.button>
      }
    >
      <div className="mt-8">
        {!notified ? (
          <motion.div
            className="rounded-2xl border border-pulse-border bg-pulse-card p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-heading font-bold text-lg text-pulse-text mb-2">Notify me when ready</h3>
            <p className="text-sm font-body text-pulse-muted mb-4">
              Enter your email or phone number to receive an alert as soon as your personalized trends are ready.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Email or phone number..."
                value={notificationValue}
                onChange={(e) => setNotificationValue(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-pulse-border bg-pulse-bg text-pulse-text font-body placeholder:text-pulse-muted focus:outline-none focus:border-pulse-text/40 transition-colors"
              />
              <motion.button
                className={`px-6 py-3 rounded-xl font-heading font-bold text-sm transition-colors ${
                  notificationValue.trim()
                    ? "bg-pulse-lime text-pulse-text hover:bg-pulse-lime/90"
                    : "bg-pulse-elevated text-pulse-muted cursor-not-allowed"
                }`}
                whileTap={notificationValue.trim() ? { scale: 0.95 } : {}}
                onClick={handleNotify}
              >
                Notify Me
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="rounded-2xl border border-pulse-lime/40 bg-pulse-lime/10 p-6 flex items-start gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-2xl mt-1">✅</span>
            <div>
              <h3 className="font-heading font-bold text-pulse-text text-lg mb-1">We'll notify you</h3>
              <p className="text-sm font-body text-pulse-text/80">
                You will receive a notification at <span className="font-semibold">{notificationValue}</span> when your first Trend Intelligence report is ready.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Background illustration / loader */}
      <div className="mt-12 flex justify-center opacity-80 pointer-events-none">
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-dashed border-pulse-lime/40 flex items-center justify-center relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-dashed border-pulse-purple/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-4xl block" style={{ transform: "rotate(0deg)" }}>⏳</span>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
}
