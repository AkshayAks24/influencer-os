export interface InstagramAccountStats {
  username: string;
  profilePicUrl: string;
  followers: number;
  following: number;
  totalPosts: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  reachLast30Days: number;
  impressionsLast30Days: number;
  followerGrowthPercent: number;
  topAudience: {
    ageRange: string;
    gender: string;
    topCities: string[];
  };
}

export interface InstagramPost {
  id: string;
  thumbnailUrl: string;
  caption: string;
  type: "image" | "video" | "reel" | "carousel";
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  postedAt: string;
}

export type TrendReportStatus = "preparing" | "completed" | "failed";

export interface TrendDetailItem {
  trend: string;
  momentum: string;
  matchPercent: number;
  suggestedAngle: string;
}

export interface TrendAnalysisReport {
  id: string;
  title: string;
  status: TrendReportStatus;
  requestedAt: string;
  completedAt: string | null;
  summary: string;
  trendCount: number;
  topTrends: string[];
  matchScore: number;
  niche: string;
  detailedInsights?: TrendDetailItem[];
  contentOpportunities?: string[];
  audienceOverlap?: number;
}

export interface InsightTip {
  text: string;
  emoji: string;
}

export type DashboardTab = "overview" | "trends" | "reports";
