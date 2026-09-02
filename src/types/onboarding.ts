export interface OnboardingData {
  niche: string;
  customNiche: string;
  audiences: string[];
  location: string;
  languages: string[];
  goals: string[];
  contentFormats: string[];
  faceVisibility: "yes" | "sometimes" | "no" | "";
  challenge: string;
  connectedAccounts: ConnectedAccount[];
  aiInsights?: {
    bestContent: string;
    style: string;
    avoid: string;
  };
}

export interface ConnectedAccount {
  platform: "instagram" | "youtube" | "tiktok" | "twitter";
  username: string;
  connected: boolean;
}

export interface OnboardingOption {
  id: string;
  label: string;
  emoji: string;
}

export interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
}

export const ONBOARDING_INITIAL_DATA: OnboardingData = {
  niche: "",
  customNiche: "",
  audiences: [],
  location: "",
  languages: [],
  goals: [],
  contentFormats: [],
  faceVisibility: "",
  challenge: "",
  connectedAccounts: [],
  aiInsights: undefined,
};

export type OnboardingStep =
  | "welcome"
  | "niche"
  | "audience"
  | "goal"
  | "content"
  | "challenge"
  | "connect"
  | "analysis"
  | "dna"
  | "preparation";
