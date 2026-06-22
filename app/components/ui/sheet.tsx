// components/ui/sheet.tsx v2.1 —— 侧边抽屉组件（普通 div，无 motion）
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// 上下文
// ---------------------------------------------------------------------------

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(): SheetContextValue {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used inside <Sheet>");
  return ctx;
}

// ---------------------------------------------------------------------------
// 根组件
// ---------------------------------------------------------------------------

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, isControlled]
  );

  const value = React.useMemo(
    () => ({ open: !!open, onOpenChange: handleOpenChange }),
    [open, handleOpenChange]
  );

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

// ---------------------------------------------------------------------------
// SheetTrigger（打开按钮）
// ---------------------------------------------------------------------------

export const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function SheetTrigger({ children, onClick, className, ...rest }, ref) {
  const { onOpenChange } = useSheetContext();
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(true);
      }}
      className={cn("cursor-pointer", className)}
      {...rest}
    >
      {children}
    </button>
  );
});

// ---------------------------------------------------------------------------
// SheetContent（侧边抽屉内容）
// ---------------------------------------------------------------------------

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

export function SheetContent({
  side = "right",
  size = "md",
  className,
  children,
  ...rest
}: SheetContentProps) {
  const { open, onOpenChange } = useSheetContext();

  // 根据 size 定义宽度
  const sizeClass = React.useMemo(() => {
    const widths: Record<string, string> = {
      sm: "max-w-xs",
      md: "max-w-sm",
      lg: "max-w-md",
      xl: "max-w-lg",
    };
    if (side === "top" || side === "bottom") return "max-h-[70vh]";
    return widths[size] || "max-w-sm";
  }, [side, size]);

  // ESC 键关闭
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {/* 内容抽屉 */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-lg border-border overflow-y-auto",
          side === "right" && "right-0 top-0 h-full border-l",
          side === "left" && "left-0 top-0 h-full border-r",
          side === "top" && "top-0 left-0 w-full border-b",
          side === "bottom" && "bottom-0 left-0 w-full border-t",
          sizeClass,
          className
        )}
        style={{
          animation: "slideIn 0.3s ease-out forwards",
        }}
        {...rest}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: ${side === "right"
              ? "translateX(100%)"
              : side === "left"
              ? "translateX(-100%)"
              : side === "top"
              ? "translateY(-100%)"
              : "translateY(100%)"};
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// ---------------------------------------------------------------------------
// SheetHeader / SheetTitle / SheetDescription / SheetFooter / SheetClose
// ---------------------------------------------------------------------------

export function SheetHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-4 border-b border-border",
        className
      )}
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
