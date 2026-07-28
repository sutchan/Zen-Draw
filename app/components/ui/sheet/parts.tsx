// components/ui/sheet/parts.tsx v5.1.1 —— Sheet 布局部件（Header/Title/Description/Footer/Close）
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSheetContext } from "./context";

export function SheetHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-4 border-b border-border", className)}
      {...rest}
    />
  );
}

export function SheetTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-foreground", className)}
      {...rest}
    />
  );
}

export function SheetDescription({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...rest} />
  );
}

export function SheetFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 p-4 border-t border-border sm:flex-row sm:justify-end",
        className
      )}
      {...rest}
    />
  );
}

export const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function SheetClose({ children, onClick, className, ...rest }, ref) {
  const { onOpenChange } = useSheetContext();
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      {...rest}
    >
      {children ?? <X className="size-4" aria-hidden="true" />}
    </button>
  );
});
