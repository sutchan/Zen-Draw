// components/ui/alert.tsx v1.0 — shadcn/ui Alert
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "destructive" | "success" | "warning" | "info";

const variantClasses: Record<Variant, string> = {
  default: "border-border bg-card text-card-foreground",
  destructive:
    "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive",
  success:
    "border-[oklch(0.6_0.2_145)/40] bg-[oklch(0.6_0.2_145)/10] text-[oklch(0.45_0.18_145)] dark:text-[oklch(0.7_0.2_145)]",
  warning:
    "border-[oklch(0.7_0.15_60)/40] bg-[oklch(0.7_0.15_60)/10] text-[oklch(0.5_0.15_60)] dark:text-[oklch(0.75_0.18_60)]",
  info:
    "border-[oklch(0.6_0.15_240)/40] bg-[oklch(0.6_0.15_240)/10] text-[oklch(0.45_0.15_240)] dark:text-[oklch(0.7_0.18_240)]",
};

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: Variant }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "w-full rounded-lg border px-4 py-3 text-sm [&>div+div]:text-[0.9em] [&>div+div]:text-muted-foreground",
      variantClasses[variant],
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
