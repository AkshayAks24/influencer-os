import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import type { OnboardingData } from "@/types/onboarding";
import onboardingDataJson from "@/data/onboarding.json";

interface CreatorDNAStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
}

export function CreatorDNAStep({ data, onNext, onBack }: CreatorDNAStepProps) {
  // Helpers to map IDs to labels
  const getNicheLabel = () => {
    if (data.niche === "other") return data.customNiche;
    const found = onboardingDataJson.niches.find((n) => n.id === data.niche);
    return found ? found.label : data.niche;
  };

  const getAudienceLabel = () => {
    const audLabels = data.audiences
      .map((id) => onboardingDataJson.audiences.find((a) => a.id === id)?.label || id)
      .join(" · ");
    return `${audLabels} · ${data.location}`;
  };

  const getGoalLabel = () => {
    return data.goals
      .map((id) => onboardingDataJson.goals.find((g) => g.id === id)?.label || id)
      .join(" · ");
  };

  const getFormatLabel = () => {
    return data.contentFormats
      .map((id) => onboardingDataJson.contentFormats.find((f) => f.id === id)?.label || id)
      .join(" · ");
  };

  return (
    <OnboardingLayout
      step="dna"
      stepIndex={6}
      totalSteps={8}
      heading="Your Creator DNA"
      onBack={onBack}
      footer={
        <motion.button
          className="w-full py-3.5 rounded-full font-heading font-bold text-base transition-all bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg"
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
        >
          Continue
        </motion.button>
      }
    >
      <div className="space-y-4">
        <DNASection label="Niche" value={getNicheLabel()} />
        <DNASection label="Audience" value={getAudienceLabel()} />
        <DNASection label="Primary Goal" value={getGoalLabel()} />
        
        {data.aiInsights && (
          <>
            <DNASection label="Best Content" value={data.aiInsights.bestContent} isAi />
            <DNASection label="Preferred Format" value={getFormatLabel()} />
            <DNASection label="Style" value={data.aiInsights.style} isAi />
            <DNASection label="Avoid" value={data.aiInsights.avoid} isAi />
          </>
        )}
      </div>
    </OnboardingLayout>
  );
}

function DNASection({ label, value, isAi = false }: { label: string; value: string; isAi?: boolean }) {
  return (
    <motion.div
      className="flex flex-col gap-1 p-4 rounded-xl border border-pulse-border bg-pulse-card"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-pulse-muted">
        {label}
        {isAi && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-pulse-lime/20 text-pulse-lime">AI Insight</span>
        )}
      </div>
      <div className="text-base font-body font-medium text-pulse-text">{value || "—"}</div>
    </motion.div>
  );
}
