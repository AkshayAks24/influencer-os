export type Category = "Fashion" | "Tech" | "Fitness" | "Beauty" | "Food" | "Travel" | "Lifestyle" | "Gaming";

export interface PlatformStats {
  followers: number;
  handle: string;
  url?: string;
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  category: Category;
  location: string;
  platforms: {
    instagram?: PlatformStats;
    youtube?: PlatformStats;
    tiktok?: PlatformStats;
    twitter?: PlatformStats;
  };
  engagementRate: number; // Percentage (e.g., 4.5)
  trustScore: number; // 0-100
  bio: string;
  verified: boolean;
  pricingTiers: {
    story?: number;
    post?: number;
    video?: number;
    bundle?: number;
  };
  pastCollaborations: {
    brandName: string;
    campaignName: string;
    roi: string; // e.g., "3.2x Return"
    impressions: number;
  }[];
  reviews: {
    brandName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
  }[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  industry: string;
  campaignsPosted: number;
  activeCampaigns: number;
}

export type CampaignStatus = "Draft" | "Active" | "In Review" | "Completed";

export interface Campaign {
  id: string;
  title: string;
  brand: Brand;
  status: CampaignStatus;
  deliverables: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  budget: number;
  assignedInfluencers: Pick<Influencer, "id" | "name" | "avatar">[];
  contentApprovalStatus: "Pending" | "Approved" | "Rejected";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  highlighted: boolean;
}

export type NotificationType = "message" | "campaign" | "system" | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isOwnMessage: boolean;
}
