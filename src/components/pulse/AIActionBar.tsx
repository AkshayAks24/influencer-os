import { motion } from "framer-motion";
import type { AIAction } from "@/types/pulse";

interface AIActionBarProps {
  actions: AIAction[];
  onAction: (id: string) => void;
}

export function AIActionBar({ actions, onAction }: AIActionBarProps) {
  return (
    <div>
      <p className="text-xs font-bold font-heading uppercase tracking-wider text-pulse-muted mb-3">
        Ask AI ✨
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-hide">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            className="flex-shrink-0 snap-start inline-flex items-center gap-1.5 rounded-full border border-pulse-purple/30 bg-pulse-purple/5 px-4 py-2 text-sm font-semibold font-body text-pulse-text hover:bg-pulse-purple/15 hover:border-pulse-purple/50 transition-colors duration-200"
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.03 }}
            onClick={(e) => {
              e.stopPropagation();
              onAction(action.id);
            }}
          >
            <span>{action.emoji}</span>
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
