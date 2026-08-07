export type CampaignStatus = "active" | "completed" | "draft" | "paused";

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  budget: number;
  spent: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  platforms: string[];
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
  };
}
