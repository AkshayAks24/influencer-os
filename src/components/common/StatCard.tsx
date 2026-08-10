import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
  loading = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl bg-card border border-border flex flex-col justify-between transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </h3>
        <div className="p-2 bg-secondary rounded-lg text-foreground">
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        {loading ? (
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        ) : (
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">{value}</h2>
        )}
        
        {trend && !loading && (
          <div className="mt-2 flex items-center text-sm">
            <span
              className={cn(
                "flex items-center font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-destructive",
                trend.direction === "neutral" && "text-muted-foreground"
              )}
            >
              {trend.direction === "up" && <FiTrendingUp className="mr-1 h-4 w-4" />}
              {trend.direction === "down" && <FiTrendingDown className="mr-1 h-4 w-4" />}
              {trend.direction === "neutral" && <FiMinus className="mr-1 h-4 w-4" />}
              
              {trend.direction === "up" ? "+" : ""}
              {trend.value}%
            </span>
            <span className="ml-2 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
