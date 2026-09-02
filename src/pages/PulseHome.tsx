import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GreetingHero } from "@/components/pulse/GreetingHero";
import { OpportunityCard } from "@/components/pulse/OpportunityCard";
import { PulseLoader } from "@/components/pulse/PulseLoader";
import { EmptyStatePulse } from "@/components/pulse/EmptyStatePulse";
import pulseFeedData from "@/data/pulse-feed.json";
import type { TrendSignal, AIAction, PulseGreeting } from "@/types/pulse";

function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function PulseHome() {
  const [isLoading, setIsLoading] = useState(true);

  const trends = pulseFeedData.trends as TrendSignal[];
  const aiActions = pulseFeedData.aiActions as AIAction[];

  const greeting: PulseGreeting = {
    timeOfDay: getTimeOfDay(),
    headline: pulseFeedData.greeting.headline,
    subtext: pulseFeedData.greeting.subtext,
    opportunityCount: trends.length,
  };

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PulseLoader />;
  }

  if (!trends.length) {
    return <EmptyStatePulse onNotify={() => console.log("Notify me clicked")} />;
  }

  return (
    <div className="w-full max-w-[680px] mx-auto px-4 sm:px-6 pb-28">
      <GreetingHero greeting={greeting} />

      {/* Feed */}
      <div className="mt-4 space-y-5">
        {trends.map((trend, i) => (
          <OpportunityCard
            key={trend.id}
            trend={trend}
            aiActions={aiActions}
            index={i}
          />
        ))}
      </div>

      {/* End of feed */}
      <motion.div
        className="mt-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-lg font-heading font-bold text-pulse-text mb-1">
          That's everything for now 🎯
        </p>
        <p className="text-sm font-body text-pulse-muted">
          Check back later for new opportunities.
        </p>
      </motion.div>
    </div>
  );
}
