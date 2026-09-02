export interface AdminStats {
  totalInfluencers: number;
  researching: number;
  trends: number;
  aiProcessing: number;
  reports: number;
}

export interface AdminInfluencer {
  id: string;
  name: string;
  niche: string;
  platform: string;
  goal: string;
  status: "active" | "researching" | "pending";
}

export interface AdminCreatorProfile extends AdminInfluencer {
  audience: string;
  location: string;
  language: string;
  contentPreferences: string[];
  connectedAccounts: string[];
  topContent: string;
  historicalPerformance: string;
  creatorDNA: {
    bestContent: string;
    style: string;
    avoid: string;
  };
}
