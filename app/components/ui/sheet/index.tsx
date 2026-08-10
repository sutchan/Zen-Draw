// components/ui/sheet/index.tsx v5.7.1 —— 侧边抽屉组件（Trigger + Content + 部件聚合导出）
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSheetContext } from "./context";

export { Sheet, useSheetContext } from "./context";
export type { SheetProps } from "./context";
export {
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./parts";

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

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
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

  // size 仅用于上下滑入时的高度约束；左右滑入的宽度完全由调用方 className 决定，
  // 避免默认 max-w-* 压制调用方传入的 w-[420px] 等精确宽度。
  const sizeClass = React.useMemo(() => {
    if (side === "top" || side === "bottom") {
      const heights: Record<string, string> = {
        sm: "max-h-[40vh]",
        md: "max-h-[70vh]",
        lg: "max-h-[85vh]",
        xl: "max-h-[95vh]",
      };
      return heights[size] || "max-h-[70vh]";
    }
    return "";
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
          "fixed z-50 flex h-full flex-col bg-background shadow-lg border-border",
          side === "right" && "right-0 top-0 border-l",
          side === "left" && "left-0 top-0 border-r",
          side === "top" && "top-0 left-0 w-full border-b",
          side === "bottom" && "bottom-0 left-0 w-full border-t",
          sizeClass,
          className
        )}
        style={{ animation: "sheet-slideIn 0.3s ease-out forwards" }}
        {...rest}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes sheet-slideIn {
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

