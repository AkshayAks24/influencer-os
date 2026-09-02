import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OnboardingData, OnboardingStep } from "@/types/onboarding";
import { ONBOARDING_INITIAL_DATA } from "@/types/onboarding";

import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { NicheStep } from "@/components/onboarding/NicheStep";
import { AudienceStep } from "@/components/onboarding/AudienceStep";
import { GoalStep } from "@/components/onboarding/GoalStep";
import { ContentPrefsStep } from "@/components/onboarding/ContentPrefsStep";
import { ChallengeStep } from "@/components/onboarding/ChallengeStep";
import { ConnectAccountsStep } from "@/components/onboarding/ConnectAccountsStep";
import { AIAnalysisStep } from "@/components/onboarding/AIAnalysisStep";
import { CreatorDNAStep } from "@/components/onboarding/CreatorDNAStep";
import { PreparationStep } from "@/components/onboarding/PreparationStep";

const STEPS: OnboardingStep[] = [
  "welcome",
  "niche",
  "audience",
  "goal",
  "content",
  "challenge",
  "connect",
  "analysis",
  "dna",
  "preparation",
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData>(ONBOARDING_INITIAL_DATA);

  const goTo = (step: OnboardingStep) => setCurrentStep(step);
  const stepIdx = STEPS.indexOf(currentStep);
  const nextStep = () => stepIdx < STEPS.length - 1 && goTo(STEPS[stepIdx + 1]);
  const prevStep = () => stepIdx > 0 && goTo(STEPS[stepIdx - 1]);

  const handleComplete = () => {
    // Save onboarding data (would go to backend in production)
    console.log("Onboarding complete:", data);
    navigate("/influencer/dashboard");
  };

  switch (currentStep) {
    case "welcome":
      return <WelcomeStep onNext={nextStep} />;

    case "niche":
      return (
        <NicheStep
          value={data.niche}
          customNiche={data.customNiche}
          onUpdate={(niche, customNiche) => setData({ ...data, niche, customNiche })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case "audience":
      return (
        <AudienceStep
          audiences={data.audiences}
          location={data.location}
          languages={data.languages}
          onUpdate={(audiences, location, languages) =>
            setData({ ...data, audiences, location, languages })
          }
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case "goal":
      return (
        <GoalStep
          goals={data.goals}
          onUpdate={(goals) => setData({ ...data, goals })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case "content":
      return (
        <ContentPrefsStep
          formats={data.contentFormats}
          faceVisibility={data.faceVisibility}
          onUpdate={(contentFormats, faceVisibility) =>
            setData({ ...data, contentFormats, faceVisibility: faceVisibility as OnboardingData["faceVisibility"] })
          }
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case "challenge":
      return (
        <ChallengeStep
          challenge={data.challenge}
          onUpdate={(challenge) => setData({ ...data, challenge })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case "connect":
      return (
        <ConnectAccountsStep
          connectedAccounts={data.connectedAccounts}
          onUpdate={(connectedAccounts) => setData({ ...data, connectedAccounts })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case "analysis":
      return (
        <AIAnalysisStep
          onNext={nextStep}
          onUpdateInsights={(aiInsights) => setData({ ...data, aiInsights })}
        />
      );

    case "dna":
      return <CreatorDNAStep data={data} onNext={nextStep} onBack={prevStep} />;

    case "preparation":
      return <PreparationStep onComplete={handleComplete} onBack={prevStep} />;

    default:
      return <WelcomeStep onNext={nextStep} />;
  }
}
