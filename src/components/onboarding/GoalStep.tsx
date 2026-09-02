import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import { SelectableCard } from "./SelectableCard";
import onboardingData from "@/data/onboarding.json";

interface GoalStepProps {
  goals: string[];
  onUpdate: (goals: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_GOALS = 2;

export function GoalStep({ goals, onUpdate, onNext, onBack }: GoalStepProps) {
  const toggleGoal = (id: string) => {
    if (goals.includes(id)) {
      onUpdate(goals.filter((g) => g !== id));
    } else if (goals.length < MAX_GOALS) {
      onUpdate([...goals, id]);
    }
  };

  const isValid = goals.length > 0;

  return (
    <OnboardingLayout
      step="goal"
      stepIndex={2}
      totalSteps={7}
      heading="What do you want to achieve?"
      description={`Pick up to ${MAX_GOALS} goals that matter most to you.`}
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
      <div className="grid grid-cols-1 gap-3">
        {onboardingData.goals.map((goal) => (
          <SelectableCard
            key={goal.id}
            emoji={goal.emoji}
            label={goal.label}
            selected={goals.includes(goal.id)}
            onClick={() => toggleGoal(goal.id)}
            size="lg"
            disabled={!goals.includes(goal.id) && goals.length >= MAX_GOALS}
          />
        ))}
      </div>

      {goals.length >= MAX_GOALS && (
        <motion.p
          className="mt-3 text-xs font-body text-pulse-muted text-center"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Maximum {MAX_GOALS} goals selected
        </motion.p>
      )}
    </OnboardingLayout>
  );
}
