export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  avatarUrl: string;
  niche: string[];
  followers: number;
  engagementRate: number;
  matchScore: number; // Used for "AI Match" badge
}
