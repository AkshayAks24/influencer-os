export type TrendCategory = "hot" | "emerging" | "momentum" | "ai_idea" | "insight";

export interface ContentPreview {
  id: string;
  type: "reel" | "short" | "post" | "tweet";
  thumbnailUrl: string;
  creatorName: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
}

export interface TrendSignal {
  id: string;
  category: TrendCategory;
  title: string;
  matchPercent: number;
  description: string;
  angle: string;
  momentum: string;
  contentPreviews: ContentPreview[];
  whyYou: string[];
  tags: string[];
}

export interface AIAction {
  id: string;
  label: string;
  emoji: string;
}

export interface PulseGreeting {
  timeOfDay: "morning" | "afternoon" | "evening";
  headline: string;
  subtext: string;
  opportunityCount: number;
}
