import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import { SelectableCard } from "./SelectableCard";
import onboardingData from "@/data/onboarding.json";

interface ChallengeStepProps {
  challenge: string;
  onUpdate: (challenge: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ChallengeStep({ challenge, onUpdate, onNext, onBack }: ChallengeStepProps) {
  const isValid = challenge.length > 0;

  return (
    <OnboardingLayout
      step="challenge"
      stepIndex={4}
      totalSteps={7}
      heading="What's your biggest challenge right now?"
      onBack={onBack}
      footer={
        <motion.button
          className={`w-full py-3.5 rounded-full font-heading font-bold text-base transition-all ${
            isValid
              ? "bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg"
              : "bg-pulse-elevated text-pulse-muted cursor-not-allowed"
          }`}
          whileTap={isValid ? { scale: 0.97 } : {}}
          onClick={() => isValid && onNext()}
        >
          Continue
        </motion.button>
      }
    >
      <div className="grid grid-cols-1 gap-2.5">
        {onboardingData.challenges.map((ch) => (
          <SelectableCard
            key={ch.id}
            emoji={ch.emoji}
            label={ch.label}
            selected={challenge === ch.id}
            onClick={() => onUpdate(ch.id)}
            size="md"
          />
        ))}
      </div>
    </OnboardingLayout>
  );
}
