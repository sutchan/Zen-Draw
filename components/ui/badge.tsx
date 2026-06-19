// components/ui/badge.tsx v1.0 — shadcn/ui Badge
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info";

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  success:
    "bg-[oklch(0.6_0.2_145)] text-white hover:bg-[oklch(0.6_0.2_145)/80]",
  warning:
    "bg-[oklch(0.7_0.15_60)] text-[oklch(0.2_0.05_60)] hover:bg-[oklch(0.7_0.15_60)/80]",
  info:
    "bg-[oklch(0.6_0.15_240)] text-white hover:bg-[oklch(0.6_0.15_240)/80]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
