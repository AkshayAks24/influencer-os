import { motion } from "framer-motion";

interface SelectableCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function SelectableCard({
  emoji,
  label,
  selected,
  onClick,
  size = "md",
  disabled = false,
}: SelectableCardProps) {
  const sizeClasses = {
    sm: "px-3 py-2.5 text-sm gap-2",
    md: "px-4 py-3.5 text-base gap-2.5",
    lg: "px-5 py-5 text-lg gap-3",
  };

  return (
    <motion.button
      type="button"
      className={`
        flex items-center rounded-2xl border font-body font-medium transition-all duration-200 w-full text-left
        ${sizeClasses[size]}
        ${
          selected
            ? "bg-pulse-text text-pulse-white border-pulse-text shadow-lg"
            : "bg-pulse-card text-pulse-text border-pulse-border hover:border-pulse-text/30 hover:bg-pulse-elevated"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { y: -1 }}
      onClick={disabled ? undefined : onClick}
    >
      <span className={`text-xl flex-shrink-0 ${selected ? "grayscale-0" : ""}`}>
        {emoji}
      </span>
      <span className="truncate">{label}</span>
      {selected && (
        <motion.span
          className="ml-auto flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="white" fillOpacity="0.2" />
            <path d="M5.5 9L8 11.5L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}
