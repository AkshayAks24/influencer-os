import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TrendAnalysisReport } from "@/types/dashboard";
import {
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineDocumentText,
  HiOutlineArrowTrendingUp,
  HiOutlineLightBulb,
  HiOutlineRocketLaunch,
  HiXMark,
} from "react-icons/hi2";

interface TrendIntelligenceTabProps {
  reports: TrendAnalysisReport[];
  onRequestAnalysis: () => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusConfig = {
  preparing: { icon: HiOutlineClock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "Preparing" },
  completed: { icon: HiOutlineCheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200", label: "Completed" },
  failed: { icon: HiOutlineExclamationTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Failed" },
};

/* ── Report Detail Modal ───────────────────────────────── */
function ReportDetailModal({
  report,
  onClose,
}: {
  report: TrendAnalysisReport;
  onClose: () => void;
}) {
  const cfg = statusConfig[report.status];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative bg-pulse-card rounded-3xl border border-pulse-border shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-pulse-elevated text-pulse-text flex items-center justify-center hover:bg-pulse-border transition-colors"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-pulse-border">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border`}>
              <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="font-heading font-bold text-lg text-pulse-text leading-tight">
                {report.title}
              </h2>
              <span className={`inline-block mt-1 text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full ${cfg.bg} border ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
          </div>
          <p className="text-sm font-body text-pulse-muted leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 p-6 pb-4">
          <div className="text-center p-3 rounded-xl bg-pulse-elevated">
            <p className="font-heading font-bold text-xl text-pulse-text">
              {report.trendCount}
            </p>
            <p className="text-[10px] font-body text-pulse-muted mt-0.5">
              Trends Found
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-pulse-lime/10 border border-pulse-lime/30">
            <p className="font-heading font-bold text-xl text-green-600">
              {report.matchScore}%
            </p>
            <p className="text-[10px] font-body text-pulse-muted mt-0.5">
              Match Score
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-pulse-elevated">
            <p className="font-heading font-bold text-xl text-pulse-purple">
              {report.audienceOverlap ?? "—"}%
            </p>
            <p className="text-[10px] font-body text-pulse-muted mt-0.5">
              Audience Fit
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="px-6 pb-4 flex flex-wrap gap-3 text-xs font-body text-pulse-muted">
          <span>📌 Niche: <strong className="text-pulse-text">{report.niche}</strong></span>
          <span>📅 Requested: {fmtDate(report.requestedAt)}</span>
          {report.completedAt && (
            <span>✅ Completed: {fmtDate(report.completedAt)}</span>
          )}
        </div>

        {/* Trend Breakdown */}
        {report.detailedInsights && report.detailedInsights.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="font-heading font-bold text-sm text-pulse-text mb-3 flex items-center gap-2">
              <HiOutlineArrowTrendingUp className="w-4 h-4 text-pulse-purple" />
              Trend Breakdown
            </h3>
            <div className="space-y-3">
              {report.detailedInsights.map((item, idx) => (
                <motion.div
                  key={item.trend}
                  className="p-3 rounded-xl bg-pulse-elevated border border-pulse-border"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.07 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-heading font-bold text-sm text-pulse-text">
                      {item.trend}
                    </h4>
                    <span className="text-xs font-heading font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {item.momentum}
                    </span>
                  </div>
                  {/* Match bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 rounded-full bg-pulse-border overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pulse-lime to-green-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.matchPercent}%` }}
                        transition={{ duration: 0.6, delay: 0.2 + idx * 0.07 }}
                      />
                    </div>
                    <span className="text-[10px] font-heading font-bold text-pulse-text w-8 text-right">
                      {item.matchPercent}%
                    </span>
                  </div>
                  <p className="text-xs font-body text-pulse-muted leading-relaxed flex items-start gap-1.5">
                    <HiOutlineLightBulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {item.suggestedAngle}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Content Opportunities */}
        {report.contentOpportunities && report.contentOpportunities.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="font-heading font-bold text-sm text-pulse-text mb-3 flex items-center gap-2">
              <HiOutlineRocketLaunch className="w-4 h-4 text-pulse-orange" />
              Content Opportunities
            </h3>
            <div className="space-y-2">
              {report.contentOpportunities.map((opp, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/60 border border-orange-100"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.06 }}
                >
                  <span className="text-sm mt-0.5">🎯</span>
                  <p className="text-xs font-body text-pulse-text leading-relaxed">
                    {opp}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Top Trend Tags */}
        {report.topTrends.length > 0 && (
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-1.5">
              {report.topTrends.map((t) => (
                <span
                  key={t}
                  className="text-xs font-heading font-semibold bg-pulse-text text-pulse-white px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Main Tab Component ────────────────────────────────── */
export function TrendIntelligenceTab({ reports, onRequestAnalysis }: TrendIntelligenceTabProps) {
  const [requesting, setRequesting] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TrendAnalysisReport | null>(null);
  const preparingReport = reports.find((r) => r.status === "preparing");
  const completedReports = reports.filter((r) => r.status === "completed");

  const handleRequest = () => {
    setRequesting(true);
    setTimeout(() => setRequesting(false), 2000);
    onRequestAnalysis();
  };

  return (
    <div className="space-y-6">
      {/* Preparing Report Banner */}
      {preparingReport && (
        <motion.div
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-pulse-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <HiOutlineClock className="w-6 h-6 text-amber-600" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-base text-pulse-text mb-1">{preparingReport.title}</h3>
              <p className="text-sm font-body text-pulse-muted leading-relaxed mb-3">{preparingReport.summary}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-amber-200 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                    initial={{ width: "10%" }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-xs font-heading font-semibold text-amber-600">Analyzing...</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Request New Analysis */}
      <motion.div
        className="p-5 rounded-2xl bg-pulse-card border border-pulse-border shadow-pulse-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pulse-purple/10 flex items-center justify-center">
              <HiOutlineSparkles className="w-5 h-5 text-pulse-purple" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-pulse-text">Request Trend Analysis</h3>
              <p className="text-xs font-body text-pulse-muted">Get fresh insights based on latest data</p>
            </div>
          </div>
          <motion.button
            className={`px-5 py-2.5 rounded-full font-heading font-bold text-sm transition-all ${
              requesting
                ? "bg-pulse-elevated text-pulse-muted cursor-not-allowed"
                : "bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg"
            }`}
            whileTap={!requesting ? { scale: 0.95 } : {}}
            onClick={handleRequest}
            disabled={requesting}
          >
            {requesting ? (
              <span className="flex items-center gap-2">
                <motion.div className="w-4 h-4 border-2 border-pulse-muted/30 border-t-pulse-muted rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                Requesting...
              </span>
            ) : (
              "✨ New Analysis"
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Previous Reports */}
      <div>
        <h3 className="font-heading font-bold text-sm text-pulse-text mb-3 flex items-center gap-2">
          <HiOutlineDocumentText className="w-4 h-4 text-pulse-muted" />
          Previous Reports
        </h3>
        {completedReports.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">📊</span>
            <p className="font-heading font-semibold text-pulse-text mb-1">No reports yet</p>
            <p className="text-sm font-body text-pulse-muted">Request your first trend analysis above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedReports.map((report, i) => {
              const cfg = statusConfig[report.status];
              return (
                <motion.div
                  key={report.id}
                  className="p-4 rounded-2xl bg-pulse-card border border-pulse-border shadow-pulse-card hover:shadow-pulse-card-hover transition-shadow cursor-pointer group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} border`}>
                      <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-heading font-bold text-sm text-pulse-text truncate">{report.title}</h4>
                        <span className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full ${cfg.bg} border ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs font-body text-pulse-muted leading-relaxed line-clamp-2 mb-2">{report.summary}</p>
                      <div className="flex items-center gap-4 text-xs font-body text-pulse-muted">
                        <span className="flex items-center gap-1">
                          <HiOutlineArrowTrendingUp className="w-3 h-3" />
                          {report.trendCount} trends
                        </span>
                        <span>Match: {report.matchScore}%</span>
                        <span>{timeAgo(report.requestedAt)}</span>
                      </div>
                      {report.topTrends.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {report.topTrends.map((t) => (
                            <span key={t} className="text-[10px] font-heading font-semibold bg-pulse-elevated text-pulse-text px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Click hint */}
                    <span className="text-pulse-muted opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1">
                      View →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
