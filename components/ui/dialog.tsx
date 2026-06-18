// components/ui/dialog.tsx v3.1 — 完整无障碍支持
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * 模态对话框容器。
 * - 添加 role="dialog" / aria-modal="true"（屏幕阅读器识别）
 * - Esc 键关闭
 * - 滚动锁定（body overflow hidden）
 * - 打开时自动聚焦到第一个可聚焦元素，关闭时焦点回归触发元素
 * - 遮罩点击关闭
 * - 通过 aria-labelledby 与 aria-describedby 绑定 DialogTitle / DialogDescription
 */
const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    // 记录触发焦点元素
    triggerRef.current = document.activeElement as HTMLElement | null;

    // 滚动锁定
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);

    // 自动聚焦到对话框内第一个可聚焦元素
    requestAnimationFrame(() => {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables && focusables.length > 0) {
        focusables[0].focus();
      }
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // 焦点回归
      triggerRef.current?.focus?.();
    };
  }, [open, onOpenChange]);

  // 将 aria id 注入子组件（通过 Context 或直接遍历会更优雅；这里用 clone + findIndex 方式，避免在 map 回调中改变 let 变量）
  const childrenWithIds = React.useMemo(() => {
    const array = React.Children.toArray(children);
    const getType = (child: React.ReactNode): string => {
      if (!React.isValidElement(child)) return "";
      const type = (child.type as { displayName?: string })?.displayName ||
        // @ts-ignore
        (child.type as any)?.name ||
        "";
      return type;
    };
    const contentIdx = array.findIndex((c) => /DialogContent/i.test(getType(c)));
    const titleIdx = array.findIndex((c) => /DialogTitle/i.test(getType(c)));
    const descIdx = array.findIndex((c) => /DialogDescription/i.test(getType(c)));
    return array.map((child, idx) => {
      if (!React.isValidElement(child)) return child;
      if (idx === contentIdx) {
        return React.cloneElement(child as React.ReactElement<any>, {
          "aria-labelledby": titleIdx >= 0 ? titleId : undefined,
          "aria-describedby": descIdx >= 0 ? descId : undefined,
        });
      }
      if (idx === titleIdx) {
        return React.cloneElement(child as React.ReactElement<any>, { id: titleId });
      }
      if (idx === descIdx) {
        return React.cloneElement(child as React.ReactElement<any>, { id: descId });
      }
      return child;
    });
  }, [children, titleId, descId]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        role="presentation"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-md mx-4">{childrenWithIds}</div>
    </div>
  );
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = ({ children, className, ...rest }: DialogContentProps) => (
  <div
    {...rest}
    className={cn(
      "relative bg-background border border-border/30 shadow-xl rounded-2xl p-6",
      className
    )}
  >
    {children}
  </div>
);

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ children, className, ...rest }: DialogHeaderProps) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...rest}>
    {children}
  </div>
);

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = ({ children, className, ...rest }: DialogTitleProps) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...rest}>
    {children}
  </h2>
);

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = ({ children, className, ...rest }: DialogDescriptionProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...rest}>
    {children}
  </p>
);

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ children, className, ...rest }: DialogFooterProps) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}
    {...rest}
  >
    {children}
  </div>
);

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogClose = ({ className, ...rest }: DialogCloseProps) => (
  <Button
    variant="ghost"
    size="icon"
    aria-label="Close dialog"
    className={cn("absolute right-4 top-4", className)}
    {...rest}
  >
    <X className="h-4 w-4" aria-hidden="true" />
    <span className="sr-only">Close</span>
  </Button>
);

// 用于 Dialog 内部通过 displayName 匹配
(DialogContent as any).displayName = "DialogContent";
(DialogTitle as any).displayName = "DialogTitle";
(DialogDescription as any).displayName = "DialogDescription";
(DialogHeader as any).displayName = "DialogHeader";
(DialogFooter as any).displayName = "DialogFooter";
(DialogClose as any).displayName = "DialogClose";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
