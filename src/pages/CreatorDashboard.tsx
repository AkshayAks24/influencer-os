import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { DashboardTab, InstagramAccountStats, InstagramPost, TrendAnalysisReport } from "@/types/dashboard";
import { AccountOverview } from "@/components/dashboard/AccountOverview";
import { PostsGrid } from "@/components/dashboard/PostsGrid";
import { TrendIntelligenceTab } from "@/components/dashboard/TrendIntelligenceTab";
import { useAuth } from "@/contexts/AuthContext";
import dashboardData from "@/data/creator-dashboard.json";
import { HiOutlineChartBar, HiOutlineSparkles, HiOutlineSquares2X2, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: HiOutlineChartBar },
  { id: "trends", label: "Trends", icon: HiOutlineSparkles },
  { id: "reports", label: "Posts", icon: HiOutlineSquares2X2 },
];

export function CreatorDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [reports, setReports] = useState<TrendAnalysisReport[]>(
    dashboardData.trendReports as TrendAnalysisReport[]
  );

  const account = dashboardData.account as InstagramAccountStats;
  const posts = dashboardData.recentPosts as InstagramPost[];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestAnalysis = () => {
    const newReport: TrendAnalysisReport = {
      id: `report-${Date.now()}`,
      title: `On-Demand Analysis — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      status: "preparing",
      requestedAt: new Date().toISOString(),
      completedAt: null,
      summary: "Analyzing the latest trends in your niche. This may take a few minutes.",
      trendCount: 0,
      topTrends: [],
      matchScore: 0,
      niche: "Tech & Coding",
    };
    setReports((prev) => [newReport, ...prev]);

    // Simulate completion after 8 seconds
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id
            ? {
                ...r,
                status: "completed" as const,
                completedAt: new Date().toISOString(),
                summary: "Fresh analysis complete! Found 6 high-match trending topics in your niche with actionable content angles.",
                trendCount: 6,
                topTrends: ["AI Agents 2.0", "Dev Vlogging", "Open Source Drama"],
                matchScore: 91,
              }
            : r
        )
      );
    }, 8000);
  };

  if (isLoading) {
    return (
      <div className="pulse-theme min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-12 h-12 rounded-2xl bg-pulse-text flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-pulse-white text-lg font-bold font-heading">P</span>
          </motion.div>
          <p className="font-heading font-semibold text-sm text-pulse-muted">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pulse-theme min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-pulse-bg/80 backdrop-blur-xl border-b border-pulse-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pulse-text flex items-center justify-center">
                <span className="text-pulse-white text-sm font-bold font-heading">P</span>
              </div>
              <span className="text-base font-heading font-bold text-pulse-text hidden sm:inline">Creator Pulse</span>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-pulse-elevated transition-colors"
              >
                <img src={account.profilePicUrl} alt={account.username} className="w-8 h-8 rounded-full object-cover ring-1 ring-pulse-border" />
                <svg className={`w-3.5 h-3.5 text-pulse-muted transition-transform ${showUserMenu ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-56 bg-pulse-card rounded-2xl border border-pulse-border shadow-xl overflow-hidden z-50"
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-pulse-border">
                      <p className="font-heading font-bold text-sm text-pulse-text">{account.username}</p>
                      <p className="text-xs font-body text-pulse-muted">Instagram Creator</p>
                    </div>
                    {/* Menu items */}
                    <div className="p-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-heading font-semibold transition-colors ${
                  activeTab === tab.id ? "text-pulse-text" : "text-pulse-muted hover:text-pulse-text"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pulse-lime rounded-full"
                    layoutId="dashboard-tab-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                <AccountOverview account={account} />
                <div>
                  <h3 className="font-heading font-bold text-base text-pulse-text mb-4 flex items-center gap-2">
                    <HiOutlineSquares2X2 className="w-4 h-4 text-pulse-muted" />
                    Recent Posts
                  </h3>
                  <PostsGrid posts={posts.slice(0, 6)} />
                </div>
              </div>
            )}

            {activeTab === "trends" && (
              <TrendIntelligenceTab reports={reports} onRequestAnalysis={handleRequestAnalysis} />
            )}

            {activeTab === "reports" && (
              <div>
                <h2 className="font-heading font-bold text-lg text-pulse-text mb-4">All Posts</h2>
                <PostsGrid posts={posts} />
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
