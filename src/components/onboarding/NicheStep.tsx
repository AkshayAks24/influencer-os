import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import { SelectableCard } from "./SelectableCard";
import onboardingData from "@/data/onboarding.json";

interface NicheStepProps {
  value: string;
  customNiche: string;
  onUpdate: (niche: string, customNiche: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function NicheStep({ value, customNiche, onUpdate, onNext, onBack }: NicheStepProps) {
  const [customInput, setCustomInput] = useState(customNiche);

  const handleSelect = (id: string) => {
    if (id === "other") {
      onUpdate("other", customInput);
    } else {
      onUpdate(id, "");
    }
  };

  const isValid = value === "other" ? customInput.trim().length > 0 : value.length > 0;

  return (
    <OnboardingLayout
      step="niche"
      stepIndex={0}
      totalSteps={7}
      heading="What do you create content about?"
      onBack={onBack}
      footer={
        <motion.button
          className={`w-full py-3.5 rounded-full font-heading font-bold text-base transition-all ${
            isValid
              ? "bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg"
              : "bg-pulse-elevated text-pulse-muted cursor-not-allowed"
          }`}
          whileTap={isValid ? { scale: 0.97 } : {}}
          onClick={() => {
            if (isValid) {
              if (value === "other") onUpdate("other", customInput);
              onNext();
            }
          }}
        >
          Continue
        </motion.button>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        {onboardingData.niches.map((niche) => (
          <SelectableCard
            key={niche.id}
            emoji={niche.emoji}
            label={niche.label}
            selected={value === niche.id}
            onClick={() => handleSelect(niche.id)}
          />
        ))}
      </div>

      {/* Custom input for "Other" */}
      {value === "other" && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
        >
          <input
            type="text"
            placeholder="Tell us your niche..."
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              onUpdate("other", e.target.value);
            }}
            className="w-full px-4 py-3 rounded-xl border border-pulse-border bg-pulse-card text-pulse-text font-body placeholder:text-pulse-muted focus:outline-none focus:border-pulse-text/40 focus:ring-1 focus:ring-pulse-text/20 transition-colors"
            autoFocus
          />
        </motion.div>
      )}
    </OnboardingLayout>
  );
}
