import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import { SelectableCard } from "./SelectableCard";
import onboardingData from "@/data/onboarding.json";

interface ContentPrefsStepProps {
  formats: string[];
  faceVisibility: string;
  onUpdate: (formats: string[], faceVisibility: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ContentPrefsStep({
  formats,
  faceVisibility,
  onUpdate,
  onNext,
  onBack,
}: ContentPrefsStepProps) {
  const toggleFormat = (id: string) => {
    const updated = formats.includes(id)
      ? formats.filter((f) => f !== id)
      : [...formats, id];
    onUpdate(updated, faceVisibility);
  };

  const isValid = formats.length > 0 && faceVisibility.length > 0;

  return (
    <OnboardingLayout
      step="content"
      stepIndex={3}
      totalSteps={7}
      heading="What type of content do you enjoy creating?"
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
      {/* Content formats */}
      <div className="grid grid-cols-2 gap-2.5">
        {onboardingData.contentFormats.map((format) => (
          <SelectableCard
            key={format.id}
            emoji={format.emoji}
            label={format.label}
            selected={formats.includes(format.id)}
            onClick={() => toggleFormat(format.id)}
          />
        ))}
      </div>

      {/* Face visibility */}
      <div className="mt-8">
        <p className="text-base font-heading font-bold text-pulse-text mb-3">
          Do you show your face?
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {onboardingData.faceOptions.map((opt) => (
            <SelectableCard
              key={opt.id}
              emoji={opt.emoji}
              label={opt.label}
              selected={faceVisibility === opt.id}
              onClick={() => onUpdate(formats, opt.id)}
              size="sm"
            />
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
