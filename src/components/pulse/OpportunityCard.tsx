import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { TrendSignal, TrendCategory } from "@/types/pulse";
import { TrendPreviewRow } from "./TrendPreviewRow";
import { WhyYouSection } from "./WhyYouSection";
import { AIActionBar } from "./AIActionBar";
import type { AIAction } from "@/types/pulse";

interface OpportunityCardProps {
  trend: TrendSignal;
  aiActions: AIAction[];
  index: number;
}

const categoryConfig: Record<
  TrendCategory,
  { label: string; emoji: string; color: string; bgColor: string; borderColor: string }
> = {
  hot: {
    label: "HOT TREND",
    emoji: "🔥",
    color: "text-pulse-pink",
    bgColor: "bg-pulse-pink/10",
    borderColor: "border-pulse-pink/30",
  },
  emerging: {
    label: "EMERGING",
    emoji: "🌱",
    color: "text-pulse-lime",
    bgColor: "bg-pulse-lime/10",
    borderColor: "border-pulse-lime/30",
  },
  momentum: {
    label: "HIGH MOMENTUM",
    emoji: "⚡",
    color: "text-pulse-orange",
    bgColor: "bg-pulse-orange/10",
    borderColor: "border-pulse-orange/30",
  },
  ai_idea: {
    label: "AI IDEA",
    emoji: "✨",
    color: "text-pulse-purple",
    bgColor: "bg-pulse-purple/10",
    borderColor: "border-pulse-purple/30",
  },
  insight: {
    label: "INSIGHT",
    emoji: "💡",
    color: "text-pulse-blue",
    bgColor: "bg-pulse-blue/10",
    borderColor: "border-pulse-blue/30",
  },
};

function AnimatedPercent({ value, inView }: { value: number; inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value, inView]);

  return <span>{display}%</span>;
}

export function OpportunityCard({ trend, aiActions, index }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const cat = categoryConfig[trend.category];

  return (
    <motion.article
      ref={cardRef}
      className="bg-pulse-card rounded-2xl border border-pulse-border shadow-pulse-card hover:shadow-pulse-card-hover transition-shadow duration-300 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5 sm:p-7">
        {/* Category badge */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-heading uppercase tracking-wider border ${cat.bgColor} ${cat.borderColor} ${cat.color}`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </div>

        {/* Title */}
        <h2 className="mt-4 text-2xl sm:text-3xl font-heading font-bold text-pulse-text leading-tight">
          {trend.title}
        </h2>

        {/* Match bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-pulse-elevated overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  trend.category === "hot"
                    ? "#FF4FA3"
                    : trend.category === "emerging"
                    ? "#C7FF3D"
                    : trend.category === "momentum"
                    ? "#FF6B35"
                    : trend.category === "ai_idea"
                    ? "#8B5CF6"
                    : "#5B7CFF",
              }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${trend.matchPercent}%` } : {}}
              transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm font-bold font-heading text-pulse-text whitespace-nowrap">
            <AnimatedPercent value={trend.matchPercent} inView={isInView} /> MATCH
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-base text-pulse-muted font-body leading-relaxed">
          {trend.description}
        </p>

        {/* Momentum badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold font-body text-pulse-text">
          <span className="text-pulse-lime">↑</span>
          {trend.momentum}
        </div>

        {/* Your Angle */}
        <div className="mt-5 rounded-xl bg-pulse-bg p-4 border border-pulse-border">
          <p className="text-xs font-bold font-heading uppercase tracking-wider text-pulse-muted mb-2">
            Your Angle
          </p>
          <p className="text-base font-body text-pulse-text leading-relaxed">
            {trend.angle}
          </p>
        </div>

        {/* CTA */}
        <motion.button
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold font-heading text-pulse-text group"
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          <span>{expanded ? "Close" : "👀 See opportunity"}</span>
          <motion.span
            className="inline-block"
            animate={expanded ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </motion.button>
      </div>

      {/* Expanded section */}
      <motion.div
        initial={false}
        animate={expanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="px-5 sm:px-7 pb-6 space-y-5 border-t border-pulse-border pt-5">
          {/* Content previews */}
          <TrendPreviewRow contentPreviews={trend.contentPreviews} />

          {/* Why You */}
          <WhyYouSection reasons={trend.whyYou} />

          {/* AI Actions */}
          <AIActionBar
            actions={aiActions}
            onAction={(id) => console.log("AI action:", id)}
          />
        </div>
      </motion.div>
    </motion.article>
  );
}
