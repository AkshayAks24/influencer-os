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
        "rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        "p-6 transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
          {label}
        </h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="text-3xl font-bold tracking-tight">{value}</div>
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
