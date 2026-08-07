import { FiLoader } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  text?: string;
}

export function Loader({ className, size = "default", text }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 p-8", className)}>
      <FiLoader className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
}
