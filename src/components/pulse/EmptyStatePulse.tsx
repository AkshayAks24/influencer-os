import { motion } from "framer-motion";

interface EmptyStatePulseProps {
  onNotify?: () => void;
}

export function EmptyStatePulse({ onNotify }: EmptyStatePulseProps) {
  return (
    <motion.div
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.span
        className="text-6xl mb-6 block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        👀
      </motion.span>

      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-pulse-text mb-3">
        Nothing interesting yet
      </h2>

      <p className="text-base font-body text-pulse-muted max-w-sm leading-relaxed mb-2">
        We're watching your niche.
      </p>
      <p className="text-base font-body text-pulse-muted max-w-sm leading-relaxed mb-8">
        We'll let you know when something worth creating appears.
      </p>

      <motion.button
        className="inline-flex items-center gap-2 rounded-full bg-pulse-text text-pulse-white px-6 py-3 text-sm font-bold font-heading hover:bg-pulse-text/90 transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNotify}
      >
        <span>Notify me</span>
        <motion.span
          className="inline-block"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
