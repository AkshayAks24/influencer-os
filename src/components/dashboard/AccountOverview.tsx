import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InstagramAccountStats } from "@/types/dashboard";
import { FaInstagram } from "react-icons/fa";
import {
  HiOutlineUsers,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineEye,
  HiOutlineArrowTrendingUp,
  HiOutlineChartBar,
} from "react-icons/hi2";

interface AccountOverviewProps {
  account: InstagramAccountStats;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

/* ── Dynamic insight tips per stat ───────────────────── */
interface InsightTipItem {
  text: string;
  emoji: string;
}

function getTipsForStat(
  label: string,
  value: string,
  account: InstagramAccountStats
): InsightTipItem[] {
  switch (label) {
    case "Followers":
      return [
        { emoji: "📈", text: `Growing at ${account.followerGrowthPercent}% — above the 2% average for your niche` },
        { emoji: "🎯", text: "Focus on Reels to accelerate growth — they drive 3x more discovery" },
        { emoji: "💡", text: "Collaborate with creators in the 20K–50K range for maximum reach overlap" },
      ];
    case "Avg. Likes":
      return [
        { emoji: "❤️", text: `${value} avg. likes shows strong content resonance with your audience` },
        { emoji: "🔥", text: "Posts with a hook in the first 3 seconds get 40% more likes" },
        { emoji: "⏰", text: "Try posting between 6–9 PM when your audience is most active" },
      ];
    case "Avg. Comments":
      return [
        { emoji: "💬", text: "Comments signal deep engagement — more valuable than likes for the algorithm" },
        { emoji: "🤔", text: "End captions with a question to boost comment rate by up to 50%" },
        { emoji: "🤝", text: "Reply to comments within the first hour to trigger more conversation" },
      ];
    case "Engagement Rate":
      return [
        { emoji: "⭐", text: `${value} is excellent — industry average is 1.5–3% for your follower count` },
        { emoji: "📊", text: "Carousel posts tend to have 1.4x higher engagement than single images" },
        { emoji: "🎬", text: "Reels with trending audio can boost engagement by up to 2x" },
      ];
    case "Reach (30d)":
      return [
        { emoji: "👁️", text: `${value} unique accounts reached — that's ${Math.round(account.reachLast30Days / account.followers * 100)}% of your followers` },
        { emoji: "🌐", text: "Use 3–5 niche hashtags instead of 30 generic ones for better reach" },
        { emoji: "📍", text: "Geo-tagging posts in top cities can expand local discovery" },
      ];
    case "Impressions (30d)":
      return [
        { emoji: "👀", text: `${Math.round(account.impressionsLast30Days / account.reachLast30Days * 10) / 10}x impression-to-reach ratio — your content is being revisited` },
        { emoji: "🔄", text: "High impressions mean your content is being re-shown — a positive algorithm signal" },
        { emoji: "📌", text: "Save-worthy content drives repeat impressions — add value-packed tips" },
      ];
    default:
      return [{ emoji: "💡", text: "Keep monitoring this metric to track your growth" }];
  }
}

/* ── Stat card data builder ──────────────────────────── */
const statCards = (account: InstagramAccountStats) => [
  {
    label: "Followers",
    value: formatNumber(account.followers),
    icon: HiOutlineUsers,
    change: `+${account.followerGrowthPercent}%`,
  },
  {
    label: "Avg. Likes",
    value: formatNumber(account.avgLikes),
    icon: HiOutlineHeart,
    change: null,
  },
  {
    label: "Avg. Comments",
    value: formatNumber(account.avgComments),
    icon: HiOutlineChatBubbleOvalLeft,
    change: null,
  },
  {
    label: "Engagement Rate",
    value: account.engagementRate + "%",
    icon: HiOutlineChartBar,
    change: null,
  },
  {
    label: "Reach (30d)",
    value: formatNumber(account.reachLast30Days),
    icon: HiOutlineEye,
    change: null,
  },
  {
    label: "Impressions (30d)",
    value: formatNumber(account.impressionsLast30Days),
    icon: HiOutlineArrowTrendingUp,
    change: null,
  },
];

/* ── Rotating Tip Component ──────────────────────────── */
function RotatingTip({ tips }: { tips: InsightTipItem[] }) {
  const [idx, setIdx] = useState(0);

  const advance = useCallback(() => {
    setIdx((prev) => (prev + 1) % tips.length);
  }, [tips.length]);

  useEffect(() => {
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [advance]);

  return (
    <div className="mt-2 min-h-[32px]">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="text-[11px] font-body text-pulse-muted/80 leading-relaxed flex items-start gap-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <span className="flex-shrink-0">{tips[idx].emoji}</span>
          <span>{tips[idx].text}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────── */
export function AccountOverview({ account }: AccountOverviewProps) {
  const stats = statCards(account);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="flex items-center gap-4 p-5 rounded-2xl bg-pulse-card border border-pulse-border shadow-pulse-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <img
            src={account.profilePicUrl}
            alt={account.username}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-pulse-lime/40 ring-offset-2 ring-offset-pulse-bg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <FaInstagram className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-heading font-bold text-lg text-pulse-text">
            {account.username}
          </h2>
          <p className="text-sm font-body text-pulse-muted">
            {formatNumber(account.followers)} followers ·{" "}
            {formatNumber(account.following)} following ·{" "}
            {account.totalPosts} posts
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-heading font-semibold text-green-700">
            Connected
          </span>
        </div>
      </motion.div>

      {/* Stats Grid with dynamic tips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat, i) => {
          const tips = getTipsForStat(stat.label, stat.value, account);
          return (
            <motion.div
              key={stat.label}
              className="p-4 rounded-2xl bg-pulse-card border border-pulse-border shadow-pulse-card hover:shadow-pulse-card-hover transition-shadow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-pulse-elevated flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-pulse-muted" />
                </div>
                {stat.change && (
                  <span className="ml-auto text-xs font-heading font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="font-heading font-bold text-xl text-pulse-text">
                {stat.value}
              </p>
              <p className="text-xs font-body text-pulse-muted mt-0.5">
                {stat.label}
              </p>
              <RotatingTip tips={tips} />
            </motion.div>
          );
        })}
      </div>

      {/* Audience Snapshot */}
      <motion.div
        className="p-5 rounded-2xl bg-pulse-card border border-pulse-border shadow-pulse-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.5 }}
      >
        <h3 className="font-heading font-bold text-sm text-pulse-text mb-3 flex items-center gap-2">
          <HiOutlineUsers className="w-4 h-4 text-pulse-purple" />
          Audience Snapshot
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-body text-pulse-muted mb-1">Age Range</p>
            <p className="font-heading font-semibold text-sm text-pulse-text">
              {account.topAudience.ageRange}
            </p>
          </div>
          <div>
            <p className="text-xs font-body text-pulse-muted mb-1">Gender Split</p>
            <p className="font-heading font-semibold text-sm text-pulse-text">
              {account.topAudience.gender}
            </p>
          </div>
          <div>
            <p className="text-xs font-body text-pulse-muted mb-1">Top Cities</p>
            <div className="flex flex-wrap gap-1.5">
              {account.topAudience.topCities.map((city) => (
                <span
                  key={city}
                  className="text-xs font-heading font-semibold bg-pulse-elevated text-pulse-text px-2.5 py-1 rounded-full"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
