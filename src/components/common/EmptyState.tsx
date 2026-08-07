import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center animate-in fade-in-50 duration-500",
        className
      )}
    >
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mb-6 max-w-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
