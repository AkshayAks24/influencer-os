import { motion } from "framer-motion";
import type { PulseGreeting } from "@/types/pulse";

interface GreetingHeroProps {
  greeting: PulseGreeting;
}

export function GreetingHero({ greeting }: GreetingHeroProps) {
  const lines = greeting.headline.split("\n");

  return (
    <motion.section
      className="pt-8 pb-6 px-1"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {lines.map((line, i) => (
        <motion.h1
          key={i}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-pulse-text leading-[1.1] tracking-tight"
          variants={{
            hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
            },
          }}
        >
          {line.includes("👋") ? (
            <>
              {line.replace("👋", "")}
              <motion.span
                className="inline-block origin-bottom-right"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                👋
              </motion.span>
            </>
          ) : (
            line
          )}
        </motion.h1>
      ))}

      <motion.p
        className="mt-5 text-base sm:text-lg text-pulse-muted font-body"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.1 },
          },
        }}
      >
        {greeting.subtext}
      </motion.p>

      {greeting.opportunityCount > 0 && (
        <motion.div
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-pulse-lime/20 border border-pulse-lime/40 px-4 py-2"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.4, delay: 0.15, type: "spring", stiffness: 200 },
            },
          }}
        >
          <span className="w-2 h-2 rounded-full bg-pulse-lime animate-pulse" />
          <span className="text-sm font-semibold font-body text-pulse-text">
            {greeting.opportunityCount} new{" "}
            {greeting.opportunityCount === 1 ? "opportunity" : "opportunities"}{" "}
            today
          </span>
        </motion.div>
      )}
    </motion.section>
  );
}
