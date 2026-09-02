import { motion } from "framer-motion";

interface WhyYouSectionProps {
  reasons: string[];
}

export function WhyYouSection({ reasons }: WhyYouSectionProps) {
  if (!reasons.length) return null;

  return (
    <div>
      <p className="text-xs font-bold font-heading uppercase tracking-wider text-pulse-muted mb-3">
        Why You?
      </p>
      <div className="space-y-2">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2.5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.1, ease: "easeOut" }}
          >
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-pulse-lime/20 flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-pulse-text"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-sm font-body text-pulse-text leading-relaxed">
              {reason}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
